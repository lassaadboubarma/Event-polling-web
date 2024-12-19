import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AuthContext } from "../context/AuthContext";
import "./../styles/HomePage.css";

const HomePage = () => {
    const { auth } = useContext(AuthContext); // Access authentication info

    return (
        <div className="homepage">
            <Navbar />

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>Welcome to the Event Polling App</h1>
                    <p>Manage, create, and explore events seamlessly.</p>
                    <div className="cta-buttons">
                        {auth.isAuthenticated ? (
                            <>
                                <Link to="/dashboard">
                                    <button className="primary-btn">Dashboard</button>
                                </Link>
                                <Link to="/create-event">
                                    <button className="secondary-btn">Create Event</button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/signup">
                                    <button className="primary-btn">Get Started</button>
                                </Link>
                                <Link to="/login">
                                    <button className="secondary-btn">Login</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <h2>Why Use Event Polling App?</h2>
                <div className="feature-cards">
                    <div className="card">
                        <h3>Easy Event Management</h3>
                        <p>Create, edit, and manage events effortlessly. Our platform allows users to organise events with simple and intuitive tools. Stay in control of your events at all times.</p>
                    </div>
                    <div className="card">
                        <h3>Role-Based Access</h3>
                        <p>Managers can monitor and delete events easily.</p>
                    </div>
                    <div className="card">
                        <h3>User Friendly</h3>
                        <p>Intuitive design for an amazing user experience.</p>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;
