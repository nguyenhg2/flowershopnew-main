import axiosClient from './axiosClient';

const orderApi = {
    getMyOrders() {
        return axiosClient.get('/orders/my');
    },
    getById(id) {
        return axiosClient.get(`/orders/${id}`);
    },
    create(data) {
        return axiosClient.post('/orders', data);
    },
    cancel(id) {
        return axiosClient.put(`/orders/${id}/cancel`);
    },
    confirmReceived(id) {
        return axiosClient.put(`/orders/${id}/confirm`);
    }
};

export default orderApi;
