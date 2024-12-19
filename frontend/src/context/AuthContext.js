import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        isAuthenticated: false,
        token: null,
        role: null,
    });

    useEffect(() => {
        const token = Cookies.get("token");
        const role = Cookies.get("role");
        if (token) setAuth({ isAuthenticated: true, token, role });
    }, []);

    const login = (token, role) => {
        Cookies.set("token", token, { expires: 1 });
        setAuth({ isAuthenticated: true, token, role }); // Save role in auth state
    };


    const logout = () => {
        Cookies.remove("token");
        Cookies.remove("role");
        setAuth({ isAuthenticated: false, token: null, role: null });
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
