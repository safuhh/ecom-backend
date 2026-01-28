const jwt = require("jsonwebtoken");

exports.createAccessToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

exports.createRefreshToken = (user) =>
  jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
