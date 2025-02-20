const cloudinary = require("../config/Cloudinary");
require("dotenv").config();
const fs = require("fs");

const ProfileCloudinary = async (file, firstName, lastName) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: process.env.CLOUDINARY_FOLDER,
      public_id: `${firstName}_${lastName}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: "fill" },
        { quality: "90" },
        { gravity: "face" },
      ],
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

module.exports = ProfileCloudinary;
