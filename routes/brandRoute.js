const express = require("express");
const {
  createBrand,
  updateBrand,
  getBrand,
  getAllBrand,
} = require("../controller/brandCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", createBrand);
router.get("/", getAllBrand);
router.post("/:id", authMiddleware, isAdmin, updateBrand);
router.delete("/:id", updateBrand);
router.get("/:id", getBrand);
module.exports = router;
