import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    }
);

export const authApi = {
    login: (email, password) => api.post('/auth/login', { email, password }),
};

export const productApi = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    create: (data) => api.post('/products', data),
    update: (id, data) => api.put(`/products/${id}`, data),
    remove: (id) => api.delete(`/products/${id}`),
};

export const categoryApi = {
    getAll: () => api.get('/categories'),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    remove: (id) => api.delete(`/categories/${id}`),
};

export const orderApi = {
    getAll: (params) => api.get('/orders/all', { params }),
    getById: (id) => api.get(`/orders/${id}`),
    updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
    getRevenue: (params) => api.get('/orders/revenue', { params }),
    getInvoice: (id) => api.get(`/orders/${id}/invoice`),
};

export const bannerApi = {
    getAll: () => api.get('/banners/all'),
    create: (data) => api.post('/banners', data),
    update: (id, data) => api.put(`/banners/${id}`, data),
    remove: (id) => api.delete(`/banners/${id}`),
};

export const reviewApi = {
    getAll: (params) => api.get('/reviews/all', { params }),
    remove: (id) => api.delete(`/reviews/${id}`),
};

export const contactApi = {
    getAll: (params) => api.get('/contacts', { params }),
    markRead: (id) => api.put(`/contacts/${id}/read`),
    remove: (id) => api.delete(`/contacts/${id}`),
};

export const userApi = {
    getAll: (params) => api.get('/users', { params }),
    create: (data) => api.post('/users', data),
    update: (id, data) => api.put(`/users/${id}`, data),
    remove: (id) => api.delete(`/users/${id}`),
    toggle: (id) => api.put(`/users/${id}/toggle`),
};

export default api;
