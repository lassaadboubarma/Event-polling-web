const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const protect = (req, res, next) => {
    try {
        const token = req.cookies.token; // Retrieve token from cookies
        if (!token) return res.status(401).json({ message: "Access denied. No token provided." });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role; // Attach role to request
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token." });
    }
};


// Manager-only middleware
const managerOnly = (req, res, next) => {
    if (req.userRole !== "manager") {
        return res.status(403).json({ message: "Access denied, manager role required" });
    }
    next();
};

module.exports = { protect, managerOnly };
