import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import "./../styles/CreateEvent.css";

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await axiosInstance.post("/events/create", formData, { withCredentials: true });
            setSuccess("Event created successfully!");
            setTimeout(() => navigate("/events"), 1500);
        } catch (err) {
            console.error("Error creating event:", err);
            setError(err.response?.data?.message || "Failed to create event.");
        }
    };

    return (
        <div className="create-event-container">
            <h2 className="page-title">Create Event</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit} className="create-event-form">
                <div className="form-group">
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter event title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter event description"
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn">Create Event</button>
            </form>
        </div>
    );
};

export default CreateEvent;
