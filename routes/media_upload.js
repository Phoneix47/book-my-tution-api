const multer = require("multer");
const media_route = require("express").Router();
const cloudinary = require('cloudinary').v2;
require("dotenv").config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });


  const upload = multer({ dest: "public" });

media_route.post('/upload_profile_picture', upload.single("dp") ,async (req, res) => {

  try {
    await cloudinary.uploader
    .upload(req.file.path, { 
      public_id: req.file.filename,
      overwrite: true, 
      faces: false,
   
    })
    .then(result=>console.log(result.secure_url));
  
    res.status(200).send(result.secure_url)
    
  } catch (error) {
    
  }



});


module.exports = media_route;
