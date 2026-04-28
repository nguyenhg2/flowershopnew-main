import axiosClient from './axiosClient';

const productApi = {
  search(params) {
    return axiosClient.get('/api/products', { params });
  },
  getById(id) {
    return axiosClient.get(`/api/products/${id}`);
  },
  getBestSellers(count = 4) {
    return axiosClient.get('/api/products/bestsellers', { params: { count } });
  },
  getNewArrivals(count = 4) {
    return axiosClient.get('/api/products/newarrivals', { params: { count } });
  },
  getOnSale(count = 8) {
    return axiosClient.get('/api/products/onsale', { params: { count } });
  },
  create(data) {
    return axiosClient.post('/api/products', data);
  },
  update(id, data) {
    return axiosClient.put(`/api/products/${id}`, data);
  },
  remove(id) {
    return axiosClient.delete(`/api/products/${id}`);
  }
};

export default productApi;
