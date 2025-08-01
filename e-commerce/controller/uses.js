const User = require("../model/user");
const { setUser, getUser } = require("../services/secret");
const bcrypt = require('bcrypt');
const Item = require("../model/items");


async function handleImageUpload(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const { cost, color } = req.body;
        if (!cost || !color) {
            return res.status(400).json({ message: "Cost and color are required" });
        }
        const newImage = new Item({
            name: "Uploaded Image",
            images: [{
                data: req.file.buffer,
                contentType: req.file.mimetype,
            }],
            price: Number(cost),
            colors: [color],
            stock: 1,
            description: "Image uploaded via upload endpoint"
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
        const userId = req.query.userId;
        
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

        // If userId is provided, get that user's picture (for admin access)
        // Otherwise, get the current user's picture
        let user;
        if (userId) {
            // Check if the requesting user is an admin
            const requestingUser = await User.findById(userData._id);
            if (!requestingUser || requestingUser.role !== 'admin') {
                return res.status(403).json({ message: "Admin access required" });
            }
            user = await User.findById(userId);
        } else {
            user = await User.findById(userData._id);
        }
        
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
        
        // Transform users to include picture data properly
        const transformedUsers = users.map(user => ({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            gender: user.gender,
            contact: user.contact,
            address: user.address,
            role: user.role,
            picture: user.picture ? {
                data: user.picture.data,
                contentType: user.picture.contentType
            } : null
        }));
        
        res.status(200).json({ users: transformedUsers });
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
        
        // Check if trying to delete yourself
        if (userId === req.adminUser._id.toString()) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }
        
        // Check if trying to delete another admin
        const userToDelete = await User.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (userToDelete.role === 'admin') {
            return res.status(403).json({ message: "Cannot delete admin users. Only regular users can be deleted." });
        }
        
        const deletedUser = await User.findByIdAndDelete(userId);
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
}

async function handleCreateUser(req, res) {
    try {
        const { firstname, lastname, email, password, gender, contact, address } = req.body;
        
        // Validate required fields
        if (!firstname || !lastname || !email || !password || !address) {
            return res.status(400).json({ message: "First name, last name, email, password, and address are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        // Hash password
        const hashpass = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashpass,
            gender,
            contact,
            address,
            role: 'user' // Default role for admin-created users
        });

        // Handle profile picture if uploaded
        if (req.file) {
            newUser.picture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        await newUser.save();

        // Return success without token (no login)
        res.status(201).json({ 
            message: "User created successfully",
            user: {
                _id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,
                gender: newUser.gender,
                contact: newUser.contact,
                address: newUser.address,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ message: "Failed to create user", error: error.message });
    }
}

async function handleUpdateUser(req, res) {
    try {
        const userId = req.params.id;
        const { firstname, lastname, email, password, gender, contact, address } = req.body;
        
        // Validate required fields
        if (!firstname || !lastname || !email || !address) {
            return res.status(400).json({ message: "First name, last name, email, and address are required" });
        }
        
        // Find user to update
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        // Check if email is being changed and if it already exists
        if (email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists" });
            }
        }
        
        // Update user fields
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.gender = gender;
        user.contact = contact;
        user.address = address;
        
        // Update password if provided
        if (password) {
            const hashpass = await bcrypt.hash(password, 10);
            user.password = hashpass;
        }
        
        // Handle profile picture upload
        if (req.file) {
            user.picture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }
        
        await user.save();
        
        // Return success
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
            message: "User updated successfully", 
            user: userResponse 
        });
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ message: "Failed to update user" });
    }
}

module.exports = {
    handleImageUpload,
    handleGetUserProfile,
    handleGetUserPicture,
    handleUpdateUserProfile,
    handleGetAllUsers,
    handleDeleteUser,
    handleCreateUser,
    handleUpdateUser
}