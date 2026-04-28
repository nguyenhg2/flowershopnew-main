import axiosClient from './axiosClient';

const orderApi = {
  getMyOrders() {
    return axiosClient.get('/api/orders/my');
  },
  getAllOrders(status) {
    return axiosClient.get('/api/orders/all', { params: status ? { status } : {} });
  },
  getById(id) {
    return axiosClient.get(`/api/orders/${id}`);
  },
  create(data) {
    return axiosClient.post('/api/orders', data);
  },
  updateStatus(id, status) {
    return axiosClient.put(`/api/orders/${id}/status`, { status });
  },
  cancel(id) {
    return axiosClient.put(`/api/orders/${id}/cancel`);
  }
};

export default orderApi;
