import axiosClient from './axiosClient';

const productApi = {
    search(params) {
        return axiosClient.get('/products', { params });
    },
    getById(id) {
        return axiosClient.get(`/products/${id}`);
    },
    getBestSellers(count = 4) {
        return axiosClient.get('/products/bestsellers', { params: { count } });
    },
    getNewArrivals(count = 4) {
        return axiosClient.get('/products/newarrivals', { params: { count } });
    },
    getOnSale(count = 8) {
        return axiosClient.get('/products/onsale', { params: { count } });
    }
};

export default productApi;
