const { getUser } = require("../services/secret");
const User = require("../model/user");

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const user = getUser(token);
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
    req.user = user;
    next();
}

async function requireAdmin(req, res, next) {
    try {
        // First authenticate the user
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const userData = getUser(token);
        if (!userData) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        // Then check if user is admin
        const user = await User.findById(userData._id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied: Admins only" });
        }
        
        req.user = userData;
        req.adminUser = user;
        next();
    } catch (error) {
        console.error("Admin authentication error:", error);
        return res.status(500).json({ message: "Authentication error", error: error.message });
    }
}

module.exports = { authenticate, requireAdmin }; 