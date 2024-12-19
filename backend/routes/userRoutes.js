const express = require("express");
const { signup, login, logout } = require("../controllers/userController");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken"); // For future role checks

// Signup Route (Allow Role Assignment)
router.post("/signup", signup);

// Login Route
router.post("/login", login);
console.log("User routes registered at: /api/users");

// Logout Route
router.post("/logout", logout);
console.log("Logout route defined");

module.exports = router;
