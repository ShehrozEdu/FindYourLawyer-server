const jwt = require("jsonwebtoken");

const token = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY);
};

module.exports = token;
