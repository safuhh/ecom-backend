const User = require("../model/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerschema } = require("../validators/authValidator");
const { createAccessToken, createRefreshToken } = require("../utils/token");

exports.register = async (req, res) => {
 try{
   const { error } = registerschema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ email, password: hashed });

  res.json({ message: "Register success" });
 }
 catch(err){
  res.status(500).json({message:"register have some error"})
 }
};


exports.login = async (req, res) => {
try{
    const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  if (user.isBlocked) {
  return res.status(403).json({
    message: "Account blocked by admin"
  });
}


  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Wrong password" });

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  sameSite: "lax",
  secure: false, 
  path: "/",    
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


  res.json({
    token: accessToken,
    user: { _id: user._id, email: user.email, role: user.role }
  });
}
catch(err){
  console.log(err)
  res.status(500).json({message:"login have some error"})
}
};


exports.refreshToken = async (req, res) => {
try{
const token = req.cookies.refreshToken;
console.log("Cookies:", req.cookies);

if (!token) return res.status(401).json({ message: "No refresh token" });

  const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

if (user.isBlocked) {
  return res.status(403).json({
    message: "Account blocked by admin"
  });
}

  const newAccessToken = createAccessToken(user);
  res.json({ token: newAccessToken });
}
catch(err){
  console.log(err)
  res.status(500).json({message:"refresh token have some error"})
}
};

exports.logout = async (req, res) => {
  try {
  res.clearCookie("refreshToken", {
  httpOnly: true,
  sameSite: "lax",
  secure: false,
  path: "/",
});

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ message: "logout Something went wrong" });
  }
};
