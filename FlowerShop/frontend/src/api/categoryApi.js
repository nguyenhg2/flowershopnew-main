import axiosClient from './axiosClient';

const categoryApi = {
  getAll() {
    return axiosClient.get('/api/categories');
  },
  getById(id) {
    return axiosClient.get(`/api/categories/${id}`);
  },
  getBySlug(slug) {
    return axiosClient.get(`/api/categories/slug/${slug}`);
  },
  create(data) {
    return axiosClient.post('/api/categories', data);
  },
  update(id, data) {
    return axiosClient.put(`/api/categories/${id}`, data);
  },
  remove(id) {
    return axiosClient.delete(`/api/categories/${id}`);
  }
};

export default categoryApi;
