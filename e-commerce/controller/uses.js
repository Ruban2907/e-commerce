const User = require("../model/user");
const { setUser, getUser } = require("../services/secret");
const bcrypt = require('bcrypt');
const Multer = require("../model/items");
const multer = require("../middleware/multer");


async function handleImageUpload(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const { cost, color } = req.body;
        if (!cost || !color) {
            return res.status(400).json({ message: "Cost and color are required" });
        }
        const newImage = new Multer({
            picture: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            },
            cost,
            color,
        });
        await newImage.save();
        res.status(201).json({ message: "Image uploaded successfully", id: newImage._id });
    } catch (error) {
        res.status(500).json({ message: "Failed to upload image", error: error.message });
    }
}

async function handleGetUserProfile(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authorization token required" });
        }

        const token = authHeader.substring(7); 
        const userData = getUser(token);
        
        if (!userData) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await User.findById(userData._id).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userResponse = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            // name: `${user.firstname} ${user.lastname}`.trim(),
            email: user.email,
            gender: user.gender,
            contact: user.contact,
            address: user.address,
            role: user.role,
            picture: user.picture
        };

        res.status(200).json({ user: userResponse });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Failed to get user profile" });
    }
}

async function handleGetUserPicture(req, res) {
    try {
        
        let token = req.query.token;
        
        if (!token) {
            
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if (!token) {
            return res.status(401).json({ message: "Authorization token required" });
        }

        const userData = getUser(token);
        
        if (!userData) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        const user = await User.findById(userData._id);
        
        if (!user || !user.picture) {
            return res.status(404).json({ message: "Profile picture not found" });
        }

        res.set('Content-Type', user.picture.contentType);
        res.send(user.picture.data);
    } catch (error) {
        console.error("Get picture error:", error);
        res.status(500).json({ message: "Failed to get profile picture" });
    }
}

//patchaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
async function handleUpdateUserProfile(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Authorization token required" });
        }
        const token = authHeader.substring(7);
        const userData = getUser(token);
        if (!userData) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        const user = await User.findById(userData._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        
        if (req.body.firstname) user.firstname = req.body.firstname;
        if (req.body.lastname) user.lastname = req.body.lastname;
        if (req.body.email) user.email = req.body.email;
        if (req.body.gender) user.gender = req.body.gender;
        if (req.body.contact) user.contact = req.body.contact;
        if (req.body.address) user.address = req.body.address;
        if (req.body.password) {
            const hashpass = await bcrypt.hash(req.body.password, 10);
            user.password = hashpass;
        }
        if (req.file) {
            user.picture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        
        await user.save();
        
        const userResponse = {
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            name: `${user.firstname} ${user.lastname}`.trim(),
            email: user.email,
            gender: user.gender,
            contact: user.contact,
            address: user.address,
            role: user.role,
            picture: user.picture
        };
        
        res.status(200).json({ 
            message: "Profile updated successfully",
            user: userResponse 
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({ message: "Failed to update user profile" });
    }
}

async function handleGetAllUsers(req, res) {
    try {
        const users = await User.find({}, '-password');
        res.status(200).json({ users });
    } catch (error) {   
        res.status(500).json({ message: "Failed to get users", error: error.message });
    }
}

async function handleDeleteUser(req, res) {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: "User ID required" });
        }
        if (userId === req.adminUser._id.toString()) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }
        
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
}

module.exports = {
    handleImageUpload,
    handleGetUserProfile,
    handleGetUserPicture,
    handleUpdateUserProfile,
    handleGetAllUsers,
    handleDeleteUser
}