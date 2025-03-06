const cloudinary = require("../config/Cloudinary");
require("dotenv").config();
const fs = require("fs");

const PostCloudinary = async (file) => {
  try {
    console.log("===>", file.path);
    const result = await cloudinary.uploader.upload(file.path, {
      folder: process.env.CLOUDINARY_POST_FOLDER,
    });

    await fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      } else {
        console.log("Local file deleted successfully.");
      }
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
  }
};

module.exports = PostCloudinary;
