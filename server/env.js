const { config } = require("dotenv");

config();

const NODE_ENV = process.env.NODE_ENV || "development";
const MONGO_URI = process.env.MONGO_URI;
const MONGO_TEST_URI = process.env.MONGO_TEST_URI;

module.exports = {
  NODE_ENV,
  MONGO_URI,
  MONGO_TEST_URI,
};
