const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
// const s3 = new aws.S3();
require("dotenv").config();
const maxSize = 2 * 1024 * 1024;

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});
const bucket = process.env.AWS_BUCKET;

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const profileUpload = multer({
  fileFilter,
  limits: { fileSize: maxSize },
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },

    key: function (req, file, cb) {
      fileName = file.originalname;
      const fileExt = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );
      const newFileName = Date.now().toString() + "." + fileExt;
      cb(null, newFileName);
    },
  }),
});

module.exports = profileUpload;
