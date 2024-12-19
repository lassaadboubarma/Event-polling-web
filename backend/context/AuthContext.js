import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        token: null,
    });

    // Check cookies on app load
    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            setAuth({ isAuthenticated: true, token });
        }
    }, []);

    const login = (token) => {
        Cookies.set("token", token, { expires: 1 }); // Save token in cookies (expires in 1 day)
        setAuth({ isAuthenticated: true, token });
    };

    const logout = () => {
        Cookies.remove("token"); // Remove token from cookies
        setAuth({ isAuthenticated: false, token: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
