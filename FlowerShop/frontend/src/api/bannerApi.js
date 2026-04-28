import axiosClient from './axiosClient';

const bannerApi = {
  getActive() {
    return axiosClient.get('/api/banners');
  },
  getAll() {
    return axiosClient.get('/api/banners/all');
  },
  create(data) {
    return axiosClient.post('/api/banners', data);
  },
  update(id, data) {
    return axiosClient.put(`/api/banners/${id}`, data);
  },
  remove(id) {
    return axiosClient.delete(`/api/banners/${id}`);
  }
};

export default bannerApi;
