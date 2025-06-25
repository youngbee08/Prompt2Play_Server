const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");
const multer = require("multer");

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folders:"/Prompt2Play",
        allowedFormats: ['png','jpg','gif'],
        transformation : [{width: 500, height:500 }]
    }
})

const uploadImage = multer({storage});

module.exports = uploadImage;