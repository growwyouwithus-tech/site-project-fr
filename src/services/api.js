/**
 * API Service - Axios instance with interceptors
 * Handles all HTTP requests to the backend
 */

import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: '/api', // Proxy configured in vite.config.js
  withCredentials: true, // Send cookies with requests (for session)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data);
      
      // Redirect to login if unauthorized (but not if already on login page)
      if (error.response.status === 401 && window.location.pathname !== '/') {
        // Only redirect if not already redirecting
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/';
        }
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
