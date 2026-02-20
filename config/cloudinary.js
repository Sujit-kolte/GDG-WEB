const cloudinary=require("cloudinary").v2

cloudinary.config({
    cloud_name:process.CLOUDINARY_CLOUD_NAME,
    api_key:process.CLOUDINARY_API_KEY,
    api_secret:process.CLOUDINARY_API_SECRET,
});
module.exports=cloudinary;