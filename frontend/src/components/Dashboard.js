import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
    const { auth, logout } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [editEventId, setEditEventId] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", date: "" });
    const navigate = useNavigate();

    // Fetch user's events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get("/events/my-events", {
                    headers: { Authorization: `Bearer ${auth.token}` },
                    withCredentials: true,
                });
                setEvents(response.data);
            } catch (err) {
                console.error("Failed to fetch events:", err);
            }
        };

        fetchEvents();
    }, [auth.token]);

    // Handle edit button click
    const handleEditClick = (event) => {
        setEditEventId(event._id);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split("T")[0],
        });
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Save edited event
    const handleSave = async (eventId) => {
        try {
            await axiosInstance.put(
                `/events/update/${eventId}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${auth.token}` },
                    withCredentials: true,
                }
            );

            const updatedEvents = events.map((event) =>
                event._id === eventId ? { ...event, ...formData } : event
            );
            setEvents(updatedEvents);
            setEditEventId(null);
        } catch (err) {
            console.error("Error updating event:", err);
        }
    };

    // Delete event
    const handleDelete = async (eventId) => {
        try {
            await axiosInstance.delete(`/events/delete/${eventId}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
                withCredentials: true,
            });
            setEvents(events.filter((event) => event._id !== eventId));
        } catch (err) {
            console.error("Failed to delete event:", err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            {/* Home Button */}
            <div className="home-button">
                <Link to="/">
                    <button>Home</button>
                </Link>
            </div>

            <h2>Welcome to your Dashboard!</h2>
            <p>Manage your events below:</p>

            {/* Navigation Buttons */}
            <div className="dashboard-actions">
                <Link to="/create-event">
                    <button className="dashboard-button">Create Event</button>
                </Link>
                <Link to="/events">
                    <button className="dashboard-button">View All Events</button>
                </Link>
            </div>

            {/* Display User's Events */}
            <div className="dashboard-events">
                <h3>Your Events</h3>
                {events.length > 0 ? (
                    <ul>
                        {events.map((event) => (
                            <li key={event._id} className="event-item">
                                {editEventId === event._id ? (
                                    <div>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="Title"
                                        />
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            placeholder="Description"
                                        ></textarea>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleChange}
                                        />
                                        <button onClick={() => handleSave(event._id)}>
                                            Save
                                        </button>
                                        <button onClick={() => setEditEventId(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h4>{event.title}</h4>
                                        <p>{event.description}</p>
                                        <p>
                                            <strong>Date:</strong>{" "}
                                            {new Date(event.date).toLocaleDateString()}
                                        </p>
                                        <button onClick={() => handleEditClick(event)}>
                                            Edit Event
                                        </button>
                                        <button onClick={() => handleDelete(event._id)}>
                                            Delete Event
                                        </button>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You have no events yet.</p>
                )}
            </div>

            {/* Logout Button */}
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
