// external imports
const bcrypt = require("bcrypt");

// internal imports
const User = require("../models/People");

// get login page
function getLogin(req, res, next) {
  res.render("login");
}

function getSignup(req, res, next) {
  res.render("signup");
}

// add user to the database
async function addUser(req, res, next) {
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if(req.files && req.files.length > 0)
  {
    newUser = new User({
      ...req.body,
      photo: req.files[0].filename,
      password: hashedPassword,
    });
  } else {
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
  }

  // save user information or send error
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        msg: "Unknow error occured!",
      }
    })
  }
}

module.exports = {
  getLogin,
  getSignup,
  addUser
}