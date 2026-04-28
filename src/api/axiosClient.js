import axios from 'axios';

const API_BASE = 'https://localhost:5001';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('flowershop_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('flowershop_token');
      localStorage.removeItem('flowershop_user');
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
