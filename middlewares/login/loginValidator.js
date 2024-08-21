const { check, validationResult } = require("express-validator");

const loginValidator = [
  check("username")
  .isLength({
    min: 1,
  })
  .withMessage("Contact number or email is required"),
  
  check("password")
  .isLength({ min:1 })
  .withMessage("Password is required"),
];

const loginValidationHandler = function (req, res, next)
{
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if(Object.keys(mappedErrors).length === 0)
  {
    next();
  }
  else
  {
    if(res.locals.html)
    {
      res.render("login", {
        data: {
          username: req.body.username,
        },
        errors: mappedErrors,
      });
    }
    else
    {
      res.json({errors: mappedErrors});
    }
  }
}

module.exports = {
  loginValidator,
  loginValidationHandler
}