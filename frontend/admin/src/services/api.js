import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authApi = {
    login: (email, password) => api.post('/auth/login', { email, password }),
};

// Product API
export const productApi = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
};

// Category API
export const categoryApi = {
    getAll: (params) => api.get('/categories', { params }),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Order API
export const orderApi = {
    getAll: (params) => api.get('/orders', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    update: (id, data) => api.put(`/orders/${id}`, data),
    delete: (id) => api.delete(`/orders/${id}`),
};

// Contact API
export const contactApi = {
    getAll: (params) => api.get('/contacts', { params }),
    getById: (id) => api.get(`/contacts/${id}`),
    delete: (id) => api.delete(`/contacts/${id}`),
};

// User API
export const userApi = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
};

// Banner API
export const bannerApi = {
    getAll: (params) => api.get('/banners', { params }),
    getById: (id) => api.get(`/banners/${id}`),
    create: (data) => api.post('/banners', data),
    update: (id, data) => api.put(`/banners/${id}`, data),
    delete: (id) => api.delete(`/banners/${id}`),
};

// Review API
export const reviewApi = {
    getAll: (params) => api.get('/reviews', { params }),
    getById: (id) => api.get(`/reviews/${id}`),
    update: (id, data) => api.put(`/reviews/${id}`, data),
    delete: (id) => api.delete(`/reviews/${id}`),
};

export default api;
