//external imports
const express = require("express");

// internal imports
const {getLogin} = require("../controllers/authController");

const router = express.Router();

// login page
router.get("/login", getLogin);

module.exports = router;