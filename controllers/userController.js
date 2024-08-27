// external imports
const { unkink } = require("fs");
const path = require("path");

// internal imports
const User = require("../models/People");

// user index method
async function userIndex(req, res, next)
{
  try {
    const users = await User.find();
    if(res.locals.html)
    {
      res.render("users", { users: users, });
    }
    else
    {
      res.json({ users: users, });
    }
  }
  catch (err) 
  {
    next(err);
  }
}

// remove user
async function removeUser(req, res, next)
{
  try {
    const user = await User.findByIdAndDelete({
      _id: req.params.id,
    });

    // remove photo
    if(user.photo) {
      unlink(
        path.join(__dirname, `/../public/uploads/users/${user.photo}`),
      (err) => {
        if(err) console.log(err);
      }
      );
    }
  }
  catch (err)
  {
    res.status(500).json({
      errors: {
        common: {
          msg: "Could not delete the user!",
        },
      },
    });
  }
}


module.exports = {
  userIndex,
  removeUser
}