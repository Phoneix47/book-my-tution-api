const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const User = require("./models/User");

require("dotenv").config();

const app = express();
app.use(cors());

app.use(bodyParser.json());

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
        // Store hash in your password DB.

        const newUser = await new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          user_type: req.body.user_type,
          password: hash,
        });

        const user = await newUser.save();
        res.status(200).json({ data: user, message: "Successfully registerd" });
      });
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/login_user", async (req, res) => {
  try {
    console.log("login_user");
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (result) {
        

          // let access_token = jwt.sign(

          // )

          res.status(200).json({
            message: "Logged in successfully",

            access_token: "andadksajdkajsduadasudaisdjai",
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
