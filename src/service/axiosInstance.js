// src/service/axiosInstance.js
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
const API_BASE =  import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: `${API_BASE}/api/`
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Use idToken from useAuth hook
    // This assumes axiosInstance is used inside React components
    // If not, consider a different approach for non-component usage
    try {
      const { idToken } = useAuth();
      if (idToken) {
        config.headers['Authorization'] = `Bearer ${idToken}`;
      }
    } catch (e) {
      // useAuth can only be used inside React components
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
