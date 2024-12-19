import React from "react";
import { Link } from "react-router-dom";
import "./../styles/App.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">Event Polling</div>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/events">Events</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
            </div>
        </nav>
    );
};

export default Navbar;
