import axiosClient from './axiosClient';

const categoryApi = {
    getAll() {
        return axiosClient.get('/categories');
    },
    getById(id) {
        return axiosClient.get(`/categories/${id}`);
    },
    getBySlug(slug) {
        return axiosClient.get(`/categories/slug/${slug}`);
    }
};

export default categoryApi;
