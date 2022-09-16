const jwt = require("jsonwebtoken");

const token = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "50d" });
};

module.exports = token;
