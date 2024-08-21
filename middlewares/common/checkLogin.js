// external imports
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const checkLogin = (req, res, next) => {
  let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if(cookies)
  {
    try {
      let token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // pass user info to response locals
      if(res.locals.html)
      {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (err) {
      if(res.locals.html) 
      {
        res.require("/");
      }
      else
      {
        res.status(500).json({
          errors: {
            common: {
              msg: "Authentication failed!",
            },
          },
        });
      }
    }
  }
  else 
  {
    if(res.locals.html)
    {
      res.redirect("/");
    }
    else
    {
      res.status(401).json({
        error: "Authenticaion failed!",
      });
    }
  }
}

const redirectLoggedIn = function(req, res, next)
{
  let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if(!cookies)
  {
    next();
  }
  else
  {
    res.redirect("/dashboard");
  }
};

// check authorization
function requireRole(role)
{
  return function(req, res, next)
  {
    if(req.user.role && role.includes(req.user.role))
    {
      next();
    }
    else
    {
      if(res.locals.html)
      {
        next(createError(401, "You are not authorized to access the page"));
      }
      else
      {
        res.status(401).json({
          errors: {
            common: {
              msg: "You are not authorized!",
            }
          }
        });
      }
    }
  };
}


module.exports = {checkLogin, redirectLoggedIn, requireRole};