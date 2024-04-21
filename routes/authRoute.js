const express = require("express");
const router = express.Router();
const {
  createUser,
  loginUserCtrl,
  getAllUsers,
  getaUser,
  deleteaUser,
  updateUser,
  handleRefreshToken,
  logout,
  forgotPassword,
  resetPassword,
  loginAdmin,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
  createOrder,
  updateOrderStatus,
  removeProductFromCart,
  getMyOrders,
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { paymentverification, checkout } = require("../controller/paymentCtrl");

router.post("/register", createUser);
router.post("/login", loginUserCtrl);
router.post("/admin-login", loginAdmin);

router.get("/all-users", getAllUsers);
router.get("/refresh", handleRefreshToken);
router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/logout", logout);
router.get("/wishlist", authMiddleware, getWishlist);
router.get("/cart", authMiddleware, getUserCart);
router.post("/add-to-cart", authMiddleware, userCart);
router.post("/order/checkout", authMiddleware, checkout);
router.post("/order/paymentVerification", authMiddleware, paymentverification);

router.put("/edit-user", authMiddleware, updateUser);

router.post("/forgotPassword", forgotPassword);
router.put("/resetPassword", resetPassword);

router.put(
  "/order/update-order/:id",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);

router.put("/save-address", authMiddleware, saveAddress);
router.delete("/empty-cart", authMiddleware, emptyCart);
router.delete(
  "/delete-product-cart/:cartItemId",
  authMiddleware,
  removeProductFromCart
);
router.post("/cart/create-order", authMiddleware, createOrder);
router.delete("/:id", deleteaUser);
router.get("/:id", authMiddleware, isAdmin, getaUser);

module.exports = router;
