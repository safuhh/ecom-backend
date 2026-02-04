const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/isAdmin");
const authMiddleware = require("../middleware/authmidiile");
const {
  getAllOrders,
  updateOrderStatus,
} = require("../controller/adminOrderController");


router.get("/management", authMiddleware, adminAuth, getAllOrders);
router.put("/management/:id", authMiddleware, adminAuth, updateOrderStatus);



module.exports = router;
