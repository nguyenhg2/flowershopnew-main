import axiosClient from './axiosClient';

const reviewApi = {
  getByProduct(productId) {
    return axiosClient.get(`/api/reviews/product/${productId}`);
  },
  create(data) {
    return axiosClient.post('/api/reviews', data);
  }
};

export default reviewApi;
