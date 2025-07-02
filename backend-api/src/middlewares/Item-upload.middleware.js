/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const multer = require('multer');
const path = require('path');
const ApiError = require('../api-error');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img_item/');
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniquePrefix + path.extname(file.originalname));
  }
});

function imgUpload(req, res, next) {
  const upload = multer({ storage: storage }).single('image_urlFile');
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err)
      return next(
        new ApiError(400, 'loi fe')
        );
    } else if (err) {
      console.log(err)
      return next(
        
        new ApiError(
            500, 
            'loi server'
            )
        );
    }
    next();
  });
}

module.exports = imgUpload;

