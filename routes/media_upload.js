const media_route = require("express").Router();
const bodyParser = require("body-parser");
const cloudinary = require('cloudinary').v2;
require("dotenv").config();


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });


media_route.use(bodyParser.json());



media_route.post('/upload_profile_picture', async (req, res) => {




await cloudinary.uploader.upload(req.body.file).then((data) => {
    console.log(data)
}).catch((err) => {
    console.log(err)
})

});


module.exports = media_route;
