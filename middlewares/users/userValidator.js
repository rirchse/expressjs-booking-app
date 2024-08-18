// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const { unlink } = require("fs");

// internal imports
const User = require("../../models/People");

// add sign up validator
const signupValidator = [
  check("name")
  .isLength({min:1})
  .withMessage("Name is required")
  .isAlpha("en-US", { ignore: " -"})
  .withMessage("Name must not contain anything other than Alphabet")
  .trim(),

  check("email")
  .isEmail()
  .withMessage("Invalid email address")
  .trim()
  .custom(async (value) => {
    try {
      const user = await User.findOne({email:value});
      if(user) {
        throw createError("Email already is used!");
      }
    } catch (err) {
      throw createError(err.message);
    }
  }),

  check("contact")
  .isMobilePhone("bn-BD", {
    strictMode: true,
  })
  .withMessage("Contact number must be a valid Bangladeshi number")
  .custom(async (value) => {
    try {
      const user = await User.findOne({contact: value});
      if(user) {
        throw createError("Contact number already is use");
      }
    } catch(err) {
      throw createError(err.message);
    }
  }),

  check("password")
  .isStrongPassword()
  .withMessage("Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 sysmbol")
];

// validation handler
const validationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if(Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    // remove uploaded files
    if(req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `/../public/uploads/users/${filename}`), (err) => {
          if(err) console.log(err);
        }
      );
    }

    // response the errors
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = { signupValidator, validationHandler};