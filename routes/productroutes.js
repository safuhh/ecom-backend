const express = require("express");
const router = express.Router();
const {
  createproduct,
  getallproducts,
  getsingleproducts,
  updateproducts,
  deleteproduct,
} = require("../controller/productcontroller");

const auth = require("../middleware/authmidiile");
const isAdmin = require("../middleware/isAdmin");


router.get("/", getallproducts);
router.get("/:id", getsingleproducts);


router.post("/", auth, isAdmin, createproduct);
router.put("/:id", auth, isAdmin, updateproducts);
router.delete("/:id", auth, isAdmin, deleteproduct);

module.exports = router;
