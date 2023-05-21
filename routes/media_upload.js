const multer = require("multer");
const User = require("../models/User");
const media_route = require("express").Router();
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const upload = multer({ dest: "public" });

media_route.post(
  "/upload_profile_picture",
  upload.single("dp"),
  async (req, res) => {
    try {
      await cloudinary.uploader
        .upload(req.file.path, {
          public_id: req.file.filename,
          overwrite: true,
          faces: false,
        })
        .then(async (result) => {
          var url = result.secure_url;

          console.log(result.secure_url, " ___________________")

        
           await User.findById(req.body.userID).updateOne({
            profile_picture: url,
          });

          res.status(200).send("Successfully uploaded profile picture");
        });
    } catch (error) {
      res.status(500).send("Failed to upload profile picture");
    }
  }
);

module.exports = media_route;
