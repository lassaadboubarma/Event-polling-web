const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors"); // Import CORS
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // Import the dashboard route file
const eventRoutes = require("./routes/eventRoutes"); // Import event routes

dotenv.config();
connectDB();

const app = express();

// CORS Middleware (to allow frontend requests)
app.use(cors({
    origin: "http://localhost:3000", // Allow frontend URL
    credentials: true,              // Allow cookies
}));

// Built-in middlewares
app.use(express.json());
app.use(cookieParser()); // Middleware for handling cookies

// Routes
app.use("/api/users", userRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/events", eventRoutes); // Use event routes

const PORT = process.env.PORT || 5000; // Default port is 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

