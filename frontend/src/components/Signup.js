import React, { useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/users/signup", formData);
            navigate("/login");
        } catch (err) {
            console.error("Signup failed:", err.response.data.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input type="password" placeholder="Password" onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default Signup;
