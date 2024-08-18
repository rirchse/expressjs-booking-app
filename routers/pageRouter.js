// external imports
const express = require("express");

// internal imports
const { getHomepage, getApiDocs } = require("../controllers/pageController");
const decorateHtml = require("../middlewares/common/decorateHtml");

const router = express.Router();

router.get("/", decorateHtml("Home Page"), getHomepage);
router.get("/api-docs", decorateHtml("API Docs"), getApiDocs);

module.exports = router;