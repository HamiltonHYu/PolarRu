const models = require("../models/pollModels");
const bcrypt = require("bcrypt");

const userController = {};

userController.createUser = async (req, res, next) => {
  try {
    const existingUser = await models.User.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      throw Error("username already in use");
    }

    const saltRounds = 10;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) return console.log("Got bcrypt error :", err);
      const user = {
        username: req.body.username,
        password: hash,
        pollCreator: false,
        pollsList: [],
      };
      //create new user with username and pass
      const newUser = await models.User.create(user);
      //check on this later
      res.locals.userId = req.body.username;
      res.locals.id = newUser._id;
      next();
    });
  } catch (err) {
    next({
      log: "ERROR from userController.createUser",
      message: { err: `Did not create user properly ERROR: ${err}` },
    });
  }
};

userController.verifyUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    //(find) checks for user with input username
    const user = await models.User.findOne({ username: username });
    if (!user) {
      //return res.status(200).json({ noUser: "userdoesnotexist" });
      throw Error("no user with that login");
    }

    const results = await bcrypt.compare(password, user.password);

    if (!results) {
      throw Error("invalid login");
    }

    res.locals.verified = results;
    res.locals.userId = username;
    res.locals.id = user._id;

    next();
  } catch (err) {
    next({
      log: "ERROR from userController.verifyUser",
      message: { err: `Could not verify user ERROR: ${err}` },
    });
  }
};

module.exports = userController;
