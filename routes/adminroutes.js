const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  blockUser,
  unblockUser,
  changeUserRole
} = require("../controller/adminuserController");

const authMiddleware = require("../middleware/authmidiile");
const adminauth = require("../middleware/isAdmin");

router.get("/admin/users", authMiddleware, adminauth, getAllUsers);
router.put("/admin/block/:id", authMiddleware, adminauth, blockUser);
router.put("/admin/unblock/:id", authMiddleware, adminauth, unblockUser);
router.put("/admin/role/:id", authMiddleware, adminauth, changeUserRole);

module.exports = router;
