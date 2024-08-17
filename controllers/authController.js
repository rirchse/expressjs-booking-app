// get login page
function getLogin(req, res, next) {
  res.render("index", {
    title: "Login - Expressjs Booking App"
  });
}

module.exports = {
  getLogin,
}