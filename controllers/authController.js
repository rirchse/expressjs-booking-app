// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/People");

// get login page
function getLogin(req, res, next) {
  res.render("login");
}

// post login 
async function login(req, res, next)
{
  try {
    // find a user who has this email/username
    const user = await User.findOne({
      $or: [{email: req.body.username}, {mobile: req.body.username}],
    });

    if(user && user._id)
    {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if(isValidPassword)
      {
        // prepare user object to generate token
        const userObject = {
          username: user.name,
          mobile: user.mobile,
          email: user.email,
          role: user.role,
        };

        // generate token
        const token = jwt.sign(userObject, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRY,
        });

        // set cookie
        res.cookie(process.env.COOKIE_NAME, token, {
          maxAge: process.env.JWT_EXPIRY,
          httpOnly: true,
          signed: true,
        });

        // set logged in user local indentifier
        res.locals.loggedInUser = userObject;

        res.render("dashboard");
      }
      else
      {
        throw createError("Login failed! Please try again.");
      }
    }
    else
    {
      throw createError("Login failed! Please try again.");
    }

  }
  catch(err)
  {
    res.render("login", {
      data: {
        username: req.body.username,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// logout method
function logout(req, res)
{
  const cookieRes = res.clearCookie(process.env.COOKIE_NAME);
  // console.log(cookieRes);
  res.send("You are logged out!");
  // res.redirect("/");
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
  login,
  getSignup,
  addUser,
  logout
}