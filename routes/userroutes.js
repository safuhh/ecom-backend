const express = require("express");
const router = express.Router();

const { register, login, refreshToken } = require("../controller/usercontroller");
const auth = require("../middleware/authmidiile");

router.post("/register", register);
router.post("/login", login);
router.get("/refresh-token", refreshToken);
router.get("/profile", auth, (req, res) => {
  res.json({ userId: req.userId });
});

module.exports = router;
