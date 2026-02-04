const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  getSessionStatus,
  clearCart
} = require("../controller/stripe.controller");
const authMiddleware = require("../middleware/authmidiile");

router.post("/create-checkout-session", authMiddleware, createCheckoutSession);
router.get("/session-status", getSessionStatus);
router.delete("/clear", authMiddleware, clearCart);

module.exports = router;
