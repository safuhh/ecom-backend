const User = require("../model/usermodel");

exports.getAllUsers = async (req, res) => {
  const getuser = await User.find().select("-password -refreshToken");
  res.json(getuser);
};
exports.blockUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
  res.json({ message: "user blocked correct" });
};
exports.unblockUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
  res.json({ message: "user unblocked correct" });
};
exports.changeUserRole = async (req, res) => {
  const { role } = req.body;
  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "invalid role" });
  }
  await User.findByIdAndUpdate(req.params.id, { role });
  res.json({ message: `role changed ${role}` });
};

