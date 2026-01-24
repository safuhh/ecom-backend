const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const createAccessToken = (id) =>
  jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });

const createRefreshToken = (id) =>
  jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

// REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "All fields required" });

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed });

  res.json({ message: "Register success" });
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const accessToken = createAccessToken(user._id);
  const refreshToken = createRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  // 🔥 refresh token cookie
  res.cookie("refreshtoken", refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    token: accessToken,
    user: { id: user._id, email: user.email },
  });
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshtoken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const user = await User.findOne({ refreshToken: token });
    if (!user) return res.status(403).json({ message: "Invalid refresh token" });

    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const newAccessToken = createAccessToken(decoded.id);

    res.json({ token: newAccessToken });
  } catch {
    res.status(403).json({ message: "Refresh failed" });
  }
};
