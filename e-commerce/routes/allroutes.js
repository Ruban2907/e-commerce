const express = require("express");
const router = express.Router();
const {handleUserlogin, handleUserSignup, } = require("../controller/auth")
const {handleImageUpload, handleGetUserProfile, handleGetUserPicture, handleUpdateUserProfile, handleGetAllUsers, handleDeleteUser, handleCreateUser, handleUpdateUser} = require("../controller/uses")
const { authenticate, requireAdmin, requireUser } = require("../middleware/authentication");
const upload = require("../middleware/multer");
const { handleGetAllItems, handleGetItemById, handleCreateItem, handleUpdateItem, handleDeleteItem } = require("../controller/itemops");
const { handleAddToCart, handleGetCart, handleUpdateCartItem, handleRemoveFromCart, handleConfirmOrder, handleClearCart } = require("../controller/cartops");
const { handleGetAllOrders, handleGetUserOrders, handleUpdateOrderStatus, handleGetOrderStats } = require("../controller/orderops");

router.post("/signup", upload.single("picture"), handleUserSignup)
router.post("/login", handleUserlogin);
router.post("/upload-image", upload.single("picture"), handleImageUpload);
router.get("/profile", handleGetUserProfile);
router.get("/profile-picture", handleGetUserPicture);
router.patch("/profile", upload.single("picture"), handleUpdateUserProfile);


router.get("/admin/users", requireAdmin, handleGetAllUsers);
router.post("/admin/users", requireAdmin, upload.single("picture"), handleCreateUser);
router.patch("/admin/users/:id", requireAdmin, upload.single("picture"), handleUpdateUser);
router.delete("/admin/users/:id", requireAdmin, handleDeleteUser);

// Item routes - User operations (require authentication)
router.get("/items", authenticate, handleGetAllItems);
router.get("/items/:id", authenticate, handleGetItemById);

// Cart routes - User operations (require authentication)
// Cart routes - Regular users only (no admin access)
router.post("/items/:id/add-to-cart", requireUser, handleAddToCart);
router.get("/cart", requireUser, handleGetCart);
router.patch("/cart/:cartItemId", requireUser, handleUpdateCartItem);
router.delete("/cart/:cartItemId", requireUser, handleRemoveFromCart);
router.post("/cart/confirm-order", requireUser, handleConfirmOrder);
router.delete("/cart", requireUser, handleClearCart);

// Order routes - User can view their own orders
router.get("/orders", authenticate, handleGetUserOrders);

// Order routes - Admin operations (require admin authentication)
router.get("/admin/orders", requireAdmin, handleGetAllOrders);
router.patch("/admin/orders/:orderId/status", requireAdmin, handleUpdateOrderStatus);
router.get("/admin/orders/stats", requireAdmin, handleGetOrderStats);

// Item routes - Admin operations (require admin authentication)
router.post("/items", requireAdmin, upload.array("images", 5), handleCreateItem);
router.patch("/items/:id", requireAdmin, upload.array("images", 5), handleUpdateItem);
router.delete("/items/:id", requireAdmin, handleDeleteItem);

module.exports = router; 