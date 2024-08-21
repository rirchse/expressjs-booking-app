//external imports
const express = require("express");

// internal imports
const {getLogin, login, getSignup, addUser, logout} = require("../controllers/authController");
const { dashboard } = require("../controllers/dashboardController");
const decorateHtml = require("../middlewares/common/decorateHtml");
const photoUpload = require("../middlewares/users/fileUpload");
const { signupValidator, validationHandler} = require("../middlewares/users/userValidator");
const { loginValidator, loginValidationHandler } = require("../middlewares/login/loginValidator");

const { checkLogin, redirectLoggedIn } = require("../middlewares/common/checkLogin");

const router = express.Router();

// login page
router.get("/login", decorateHtml("Login"), redirectLoggedIn, getLogin);
router.post("/login", decorateHtml("Login"), loginValidator, loginValidationHandler, login);
router.get("/signup", decorateHtml("Sign Up"), getSignup);
router.post("/signup", photoUpload, signupValidator, validationHandler, addUser);

router.get("/dashboard", decorateHtml("Dashboard"), checkLogin, dashboard);

router.delete("/", logout);

module.exports = router;