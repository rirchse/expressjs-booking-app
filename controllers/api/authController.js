// external imports
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../../models/People");


async function apiLogin(req, res, next)
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

        if(res.locals.html)
        {
          res.render("dashboard");
        }
        else
        {
          const jsonUserObject = {...userObject, token}
          res.json(jsonUserObject);
        }        
        
      }
      else
      {
        throw createError("Login failed! Please try again.");
      }
    }
    else
    {
      throw createError("Login failed! Please try again..");
    }

  }
  catch(err)
  {
    if(res.locals.html)
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
    else 
    {
      res.json(err);
    }
  }
}

module.exports = {apiLogin};