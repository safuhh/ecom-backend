
const express = require("express");
const router = express.Router();
const {
  getwishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controller/wishlistcontroller");
const authMiddleware = require("../middleware/authmidiile");

router.get("/", authMiddleware, getwishlist);
router.post("/add", authMiddleware, addToWishlist);
router.delete("/remove/:productId", authMiddleware, removeFromWishlist);

module.exports = router;
