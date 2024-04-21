const express = require("express");
const {
  createCategory,
  updateCategory,
  getCategory,
  getAllCategory,
} = require("../controller/categoryCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", createCategory);
router.post("/:id", authMiddleware, isAdmin, updateCategory);
router.delete("/:id", authMiddleware, isAdmin, updateCategory);
router.get("/:id", getCategory);
router.get("/", getAllCategory);

module.exports = router;
