import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./../styles/EventsPage.css";

const EventsPage = () => {
    const [events, setEvents] = useState([]); // All events
    const [error, setError] = useState(""); // Error handling
    const { auth } = useContext(AuthContext); // Access user data (role and token)
    const [editEvent, setEditEvent] = useState(null); // Editing mode
    const [formData, setFormData] = useState({ title: "", description: "", date: "" });

    // Fetch all events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get("/events/all", { withCredentials: true });
                setEvents(response.data);
            } catch (err) {
                setError("Failed to fetch events.");
            }
        };
        fetchEvents();
    }, []);

    // Attend an event
    const handleAttend = async (eventId) => {
        try {
            await axiosInstance.post(
                `/events/attend/${eventId}`,
                {}, // No body needed
                { withCredentials: true }
            );

            // Refetch events to ensure attendees are updated
            const response = await axiosInstance.get("/events/all", { withCredentials: true });
            setEvents(response.data);
        } catch (err) {
            console.error("Failed to attend the event:", err);
            setError(err.response?.data?.message || "Failed to attend the event.");
        }
    };


    // Delete an event
    const handleDelete = async (eventId) => {
        try {
            await axiosInstance.delete(`/events/manager/delete/${eventId}`, { withCredentials: true });
            setEvents(events.filter((event) => event._id !== eventId));
        } catch (err) {
            setError("Failed to delete event.");
        }
    };

    // Edit an event
    const handleEditClick = (event) => {
        setEditEvent(event._id);
        setFormData({
            title: event.title,
            description: event.description,
            date: event.date.split("T")[0],
        });
    };

    const handleUpdate = async (eventId) => {
        try {
            await axiosInstance.put(`/events/update/${eventId}`, { ...formData }, { withCredentials: true });
            const updatedEvents = events.map((event) =>
                event._id === eventId ? { ...event, ...formData } : event
            );
            setEvents(updatedEvents);
            setEditEvent(null);
        } catch (err) {
            setError("Failed to update event.");
        }
    };

    return (
        <div className="events-container">
            {/* Home Button */}
            <Link to="/" className="home-btn">
                Home
            </Link>

            <h2 className="events-heading">All Events</h2>
            {error && <p className="error-message">{error}</p>}

            <div className="events-list">
                {events.length > 0 ? (
                    events.map((event) => (
                        <div key={event._id} className="event-card">
                            {editEvent === event._id ? (
                                <div className="edit-form">
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        placeholder="Title"
                                    />
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        placeholder="Description"
                                    ></textarea>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                    <div className="button-group">
                                        <button className="save-btn" onClick={() => handleUpdate(event._id)}>
                                            Save
                                        </button>
                                        <button className="cancel-btn" onClick={() => setEditEvent(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="event-title">{event.title}</h3>
                                    <p className="event-description">{event.description}</p>
                                    <p className="event-date">
                                        <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
                                    </p>
                                    <p className="event-creator">
                                        <strong>Created By:</strong> {event.createdBy?.email || "Unknown"}
                                    </p>



                                    {/* Attend Event Button */}
                                    {auth?.isAuthenticated && (
                                        <button className="attend-btn" onClick={() => handleAttend(event._id)}>
                                            Attend Event
                                        </button>
                                    )}

                                    {/* Edit/Delete buttons for creator or manager */}
                                    {(event.createdBy?._id === auth?.id || auth?.role === "manager") && (
                                        <button className="edit-btn" onClick={() => handleEditClick(event)}>
                                            Edit
                                        </button>
                                    )}
                                    {auth?.role === "manager" && (
                                        <button className="delete-btn" onClick={() => handleDelete(event._id)}>
                                            Delete
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-events">No events available.</p>
                )}
            </div>
        </div>
    );
};

export default EventsPage;
