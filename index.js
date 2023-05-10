const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const media_route = require('./routes/media_upload');
const tution_route = require('./routes/Tution_route')
const sendEmail = require("./utils/verfication_mail");

const Token = require("./models/Token.js");
const User = require("./models/User");


require("dotenv").config();

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use('/media', media_route)
app.use('/tution', tution_route)


const port = 8080;

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Mongodb connected"))
  .catch((err) => console.log(`error ==== ${err}`));

app.get("/", (req, res) => {
  res.send("workgin route");
});

app.post("/register_user", async (req, res) => {
  try {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        const newUser = await new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          user_type: req.body.user_type,
          password: hash,
          user_verification: false,
        });

        let token = await new Token({
          userId: newUser._id,
          token: crypto.randomBytes(64).toString("hex"),
        }).save();

        const message = `${process.env.BASE_URL}/user_verification/${newUser.id}/${token.token}`;

        await sendEmail(newUser.email, "Verify Email", message);

        const user = await newUser.save();
        res.status(200).json({ data: user, message: "Successfully registerd" });
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/resend_email", async (req, res) => {
  try {

    const access_token = req.headers["authorization"].split(" ")[1];

    jwt.verify(access_token, "secret", async (err, user) => {
      if (err) {
        res.status(401).json({
          message: err.message,
        });
      } else {
        Token.findOneAndDelete({
          userId: user.data.user_id,
        });

        let token = await new Token({
          userId: user.data.user_id,
          token: crypto.randomBytes(64).toString("hex"),
        }).save();

        const message = `${process.env.BASE_URL}/user_verification/${user.data.user_id}/${token.token}`;

        await sendEmail(user.data.email, "Verify Email", message);

        res.status(200).json({
          message : "successfully sent email"
        })

      }
    });


  } catch (error) {
    console.log(error);

    res.status(500).json({
      message : error.message
    })
  }
});

app.get("/user_verification/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) return res.status(400).send("Invalid Link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("Invalid Link");

    await User.findByIdAndUpdate(user._id, { user_verification: true });

    await Token.findByIdAndRemove(token._id);

    res.status(200).send("email verification is success");
    
  } catch (error) {
    res.status(400).send("email verification is failed");
  }
});

app.post("/login_user", async (req, res) => {
  try {
    console.log("login_user");
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
          const { first_name, last_name, email, user_verification , user_type } = user;

          const access_token = jwt.sign(
            {
              data: {
                user_id: user._id,
                email: email,
                user_type
              },
            },
            "secret",
            { expiresIn: "24h" }
          );

          console.log(access_token);

          res.status(200).json({
            message: "Logged in successfully",

            access_token: access_token,

            user_data: {
              first_name,
              last_name,
              email,
              user_verification,
              user_type
            },
          });
        } else {
          res.status(401).json({ message: "Your password is incorrect" });
        }
      });
    }
    // res.status(404).json({ message: "No User Found" });
  } catch (err) {}
});

app.listen(port, () => {
  console.log("running ", port);
});
