import axiosClient from './axiosClient';

const reviewApi = {
    getByProduct(productId) {
        return axiosClient.get(`/reviews/product/${productId}`);
    },
    create(data) {
        return axiosClient.post('/reviews', data);
    }
};

export default reviewApi;
