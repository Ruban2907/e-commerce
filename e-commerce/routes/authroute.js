const express = require("express");
const router = express.Router();
const {handleUserlogin, handleImageUpload, handleGetUserProfile, handleUserSignup, handleGetUserPicture, handleUpdateUserProfile} = require("../controller/auth")
const upload = require("../middleware/multer");

router.post("/signup", upload.single("picture"), handleUserSignup)
router.post("/login", handleUserlogin);
router.post("/upload-image", upload.single("picture"), handleImageUpload);
router.get("/profile", handleGetUserProfile);
router.get("/profile-picture", handleGetUserPicture);
router.patch("/profile", upload.single("picture"), handleUpdateUserProfile);

module.exports = router;