const express = require("express");
const router = express.Router();

const { getMonthlyRevenue } = require("../controller/Graphcontroller");
const authMiddleware = require("../middleware/authmidiile");
const adminAuth = require("../middleware/isAdmin");

router.get("/monthly-revenue", authMiddleware, adminAuth, getMonthlyRevenue);

module.exports = router;
