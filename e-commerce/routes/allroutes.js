const express = require("express");
const router = express.Router();
const {handleUserlogin, handleUserSignup, } = require("../controller/auth")
const {handleImageUpload, handleGetUserProfile, handleGetUserPicture, handleUpdateUserProfile, handleGetAllUsers, handleDeleteUser, handleCreateUser, handleUpdateUser} = require("../controller/uses")
const { authenticate, requireAdmin } = require("../middleware/authentication");
const upload = require("../middleware/multer");
const { handleGetAllItems, handleGetItemById, handleCreateItem, handleUpdateItem, handleDeleteItem } = require("../controller/itemops");

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

// Item routes - Admin operations (require admin authentication)
router.post("/items", requireAdmin, upload.array("images", 5), handleCreateItem);
router.patch("/items/:id", requireAdmin, upload.array("images", 5), handleUpdateItem);
router.delete("/items/:id", requireAdmin, handleDeleteItem);

module.exports = router; 