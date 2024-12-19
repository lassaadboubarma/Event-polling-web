const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    try {
        // Get the token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Access denied. No token provided." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        req.role = decoded.role; // Attach role if needed
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

module.exports = verifyToken;
