const cookieParser = require("cookie-parser");
const models = require("../models/pollModels");

const cookieController = {};

cookieController.createCookie = (req, res, next) => {
  try {
    if (res.locals.id) {
      res.cookie("ssid", res.locals.id);
    }
    next();
  } catch (err) {
    next({
      log: "ERROR from cookieController.createCookie",
      message: { err: `Did not set cookie properly ERROR: ${err}` },
    });
  }
};

cookieController.deleteCookie = (req, res, next) => {
  try {
    res.clearCookie("ssid");
    return next();
  } catch (err) {
    next({
      log: "ERROR from cookieController.deleteCookie",
      message: { err: `Did not delete cookie properly ERROR: ${err}` },
    });
  }
};

module.exports = cookieController;
