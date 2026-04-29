import axiosClient from './axiosClient';

const bannerApi = {
    getActive() {
        return axiosClient.get('/banners');
    }
};

export default bannerApi;
