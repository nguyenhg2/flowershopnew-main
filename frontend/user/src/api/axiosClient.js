import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' }
});

axiosClient.interceptors.request.use(config => {
    const token = localStorage.getItem('flowershop_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
    res => res,
    err => {
        if (err.response?.status === 401) {
            localStorage.removeItem('flowershop_token');
            localStorage.removeItem('flowershop_user');
        }
        return Promise.reject(err);
    }
);

export default axiosClient;
