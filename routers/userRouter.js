// external imports
const express = require("express");


// internal imports
const { userIndex, removeUser } = require("../controllers/userController");
const decorateHtml = require("../middlewares/common/decorateHtml");

const router = express.Router();

// all methods from here
router.get("/user", decorateHtml("User"), userIndex);

// remove user
router.delete("/user/:id", removeUser);


module.exports = router;