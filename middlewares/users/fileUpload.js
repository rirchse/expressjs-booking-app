const uploader = require("../../utilities/singleUpload");

// photo upload method
function photoUpload(req, res, next) {
  const upload = uploader(
    "users",
    ["image/jpeg", "image/jpg", "image/png"],
    1000000,
    "Only .jpg, jpeg or .png format allowed!"
  );

  // call the middleware function
  upload.any()(req, res, (err) => {
    if(err) {
      res.status(500).json({
        errors: {
          photo: {
            msg: err.message,
          },
        },
      });
    } else {
      next();
    }
  });
}

module.exports = photoUpload;
