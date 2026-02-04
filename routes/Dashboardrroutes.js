const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controller/Dashboardcontroller");
const authMiddleware = require("../middleware/authmidiile");
const isAdmin = require("../middleware/isAdmin");

router.get("/dashboard", authMiddleware, isAdmin, getDashboardStats);

module.exports = router;
