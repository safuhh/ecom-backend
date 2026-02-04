const express = require("express");
const router = express.Router();
const { verifyPaymentAndCreateOrder,cancelOrder ,getmyOrders } = require("../controller/ordercontrollerr");
const authMiddleware = require("../middleware/authmidiile");

router.post("/verify-payment", authMiddleware, verifyPaymentAndCreateOrder);
router.put("/cancel/:id", authMiddleware, cancelOrder );
router.get("/my-orders", authMiddleware, getmyOrders);
module.exports = router;
