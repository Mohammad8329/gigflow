import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
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
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Force redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
