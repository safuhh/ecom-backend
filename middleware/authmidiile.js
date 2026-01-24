const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token = null;

  // 1️⃣ Try header first
  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2️⃣ If no token in header, try cookie (refresh token)
  if (!token && req.cookies.refreshtoken) {
    token = req.cookies.refreshtoken;
  }

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid or expired token" });

    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
