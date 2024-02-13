const jwt = require("jsonwebtoken");
module.exports.createToken = (user) => {
  const payload = {
    email: user.email,
    _id: user._id,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};
