const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmidiile");
const {
  getcart,
  addtocart,
  removecart,
} = require("../controller/cartController");
router.get("/", authMiddleware, getcart);
router.post("/add", authMiddleware, addtocart);
router.post("/remove", authMiddleware, removecart);
module.exports = router;
