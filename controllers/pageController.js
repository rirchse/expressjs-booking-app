// pages controller
function getHomepage(req, res, next) {
  res.render("index");
}

// api docs page
function getApiDocs(req, res, next) {
  res.render("api_docs");
}

module.exports = {
  getHomepage,
  getApiDocs
}