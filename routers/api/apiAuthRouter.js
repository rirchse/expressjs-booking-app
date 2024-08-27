// external imports
const express = require("express");

//internal imports
const { apiLogin } = require("../../controllers/api/authController");
const { addUser } = require("../../controllers/authController");
const { loginValidator, loginValidationHandler } = require("../../middlewares/login/loginValidator");
const { signupValidator, validationHandler} = require("../../middlewares/users/userValidator");

const router = express.Router();

//add user route by api request
router.post("/signup", signupValidator, validationHandler, addUser);

// login route by api request
router.post("/login", loginValidator, loginValidationHandler, apiLogin);


module.exports = router;