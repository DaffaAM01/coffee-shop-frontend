import axios from "axios";

const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const adminToken = localStorage.getItem("admin_token");
    const userToken = localStorage.getItem("user_token");

    if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
});

export default api;