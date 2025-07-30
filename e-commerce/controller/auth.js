const User = require("../model/user");
const { setUser, getUser } = require("../services/secret");
const bcrypt = require('bcrypt');
const Multer = require("../model/multer");
const multer = require("../middleware/multer");

async function handleUserlogin(req,res) {
    const {email, password} = req.body;
    if (!email || !password)
    {
       return res.status(400).json({ message: "Email and Password are required" });
    }
    const foundUser = await User.findOne({ email: email });
    if(!foundUser)
    {
        return res.status(400).json('Invalid Username or Password')
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match)
    {
        const token = setUser(foundUser);
        const userData = {
            _id: foundUser._id,
            firstname: foundUser.firstname,
            lastname: foundUser.lastname,
            name: `${foundUser.firstname} ${foundUser.lastname}`.trim(),
            email: foundUser.email,
            gender: foundUser.gender,
            contact: foundUser.contact,
            address: foundUser.address,
            role: foundUser.role,
            picture: foundUser.picture
        };
        return res.status(200).json({ message: "User logged in", token, foundUser: userData });
    } else {
        return res.status(400).json('Invalid Username or Password')
    }
}


async function handleUserSignup(req,res) {
   try {
    console.log("am here")
        const {firstname, lastname, email, password, gender, contact, address} = req.body;
        const hashpass = await bcrypt.hash(password,10);
        
        const userData = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashpass,
            gender: gender,
            contact: contact,
            address: address
        };
        if (req.file) {
            userData.picture = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        const newUser = await User.create(userData);
        const token = setUser(newUser);
        
        const userResponse = {
            _id: newUser._id,
            firstname: newUser.firstname,
            lastname: newUser.lastname,
            name: `${newUser.firstname} ${newUser.lastname}`.trim(),
            email: newUser.email,
            gender: newUser.gender,
            contact: newUser.contact,
            address: newUser.address,
            role: newUser.role,
            picture: newUser.picture
        };
        
        return res.status(201).json({ 
            message: 'registered successfully', 
            token, 
            foundUser: userResponse 
        });
   } catch (error) {
        console.error("Signup error:", error);
        res.status(400).json('not registered');
   }
}


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

        // Create a response object with the name field for frontend compatibility
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
        
        // Update fields if provided
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

module.exports = {
    handleUserlogin,
    handleUserSignup,
    handleImageUpload,
    handleGetUserProfile,
    handleGetUserPicture,
    handleUpdateUserProfile
}