const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken"); // Import the verifyToken middleware

// Protected Route - This will only be accessible if the user is logged in
router.get("/dashboard", verifyToken, (req, res) => {
    res.status(200).json({ message: `Welcome to the dashboard, User ID: ${req.userId}` });
});

module.exports = router;
