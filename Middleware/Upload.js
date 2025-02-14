const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./Uploads");
  },
  filename: function (req, file, cb) {
    const FileExtension = file.originalname.split(".");
    const FileName = Date.now();
    cb(null, `${FileName}.${FileExtension[FileExtension.length - 1]}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
