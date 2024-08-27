// external imports
const express = require("express");


// internal imports
const { userIndex, removeUser } = require("../../controllers/userController");
const decorateHtml = require("../../middlewares/common/decorateHtml");
const { checkLogin, requireRole } = require("../../middlewares/common/checkLogin");

const router = express.Router();

// all methods from here
router.get("/user", checkLogin, requireRole(["admin"]), userIndex);

// remove user
router.delete("/user/:id", checkLogin, requireRole(["admin"]), removeUser);


module.exports = router;