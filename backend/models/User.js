const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "manager"], default: "user" }, // Add roles
});

module.exports = mongoose.model("User", userSchema);
