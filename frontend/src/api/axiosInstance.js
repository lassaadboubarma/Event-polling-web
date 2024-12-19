import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api", // Your backend URL
    withCredentials: true, // Allow cookies to be sent with requests
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
