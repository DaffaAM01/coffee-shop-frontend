import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    headers: {
        Accept: "application/json",
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