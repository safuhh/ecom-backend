const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  getSessionStatus,
} = require("../controller/stripe.controller");

router.post("/create-checkout-session", createCheckoutSession);
router.get("/session-status", getSessionStatus);

module.exports = router;
