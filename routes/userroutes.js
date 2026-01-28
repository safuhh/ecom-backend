const express = require("express");
const router = express.Router();

const { register, login, refreshToken, logout } = require("../controller/usercontroller");
const auth = require("../middleware/authmidiile");
const isAdmin = require("../middleware/isAdmin");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
router.get("/profile", auth, (req, res) => {
  res.json({ user: req.user });
});

router.get("/admin-profile", auth, isAdmin, (req, res) => {
  res.json({ message: "Admin access granted", user: req.user });
});


module.exports = router;
