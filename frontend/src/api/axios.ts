import axios from 'axios';

// Create a base instance pointing to your Node/Express server
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Intercept every outgoing request to attach the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;