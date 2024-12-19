import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import SignupPage from "./pages/SignupPage";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute
import CreateEvent from "./components/CreateEvent";
import EventsPage from "./pages/EventsPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
