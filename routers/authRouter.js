//external imports
const express = require("express");
// const { check } = require("express-validator");

// internal imports
const {getLogin, getSignup, addUser} = require("../controllers/authController");
const decorateHtml = require("../middlewares/common/decorateHtml");
const photoUpload = require("../middlewares/users/fileUpload");
const { signupValidator, validationHandler} = require("../middlewares/users/userValidator");

const router = express.Router();

// login page
router.get("/login", decorateHtml("Login"), getLogin);
router.get("/signup", decorateHtml("Sign Up"), getSignup);
router.post("/signup", photoUpload, signupValidator, validationHandler, addUser);

module.exports = router;