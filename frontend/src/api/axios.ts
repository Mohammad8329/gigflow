import axios from 'axios';

const api = axios.create({
    // Vite uses import.meta.env instead of process.env!
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// 1. Request Interceptor (attaches the token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor (handles token expiration / 401s)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      
      // 🛑 GUARD RAIL: Check what page the user is currently on
      const currentPath = window.location.pathname;
      
      // Only force a redirect if they are NOT on the login or register pages
      if (currentPath !== '/login' && currentPath !== '/register') {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Force redirect to login page
        window.location.href = '/login';
      }
    }
    
    // Always reject the promise so the local component's try/catch block can handle the error message!
    return Promise.reject(error);
  }
);

export default api;
