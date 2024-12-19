const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup function
const signup = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Default role is 'user' unless explicitly set to 'manager'
        const userRole = role === "manager" ? "manager" : "user";

        // Create the user
        const newUser = new User({
            email,
            password: hashedPassword,
            role: userRole,
        });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            role: userRole,
        });
    } catch (err) {
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
};

// Login function
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT with role and user id
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET, // Use secure JWT_SECRET
            { expiresIn: "30d" }
        );

        // Set token in HTTP-only cookies
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // Secure cookie in production
            sameSite: "strict", // CSRF protection
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
            message: "Login successful",
            token: token,
            role: user.role, // Send role for frontend reference
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};

// Logout function
const logout = (req, res) => {
    // Clear the cookie
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logout successful" });
};

module.exports = { signup, login, logout };
