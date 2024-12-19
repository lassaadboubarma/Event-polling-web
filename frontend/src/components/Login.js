import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import "../styles/login.css";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const response = await axiosInstance.post("/users/login", formData);
            const { token, role } = response.data;
            login(token, role);
            navigate("/dashboard");
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.response?.data?.message || "Login failed. Try again.");
        }
    };

    return (
        <div className="login-container">
            {/* Home Button */}
            <div className="home-button">
                <Link to="/">
                    <button>Home</button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
                <h2>Login</h2>
                {error && <div className="error-message">{error}</div>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
                <p>
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
