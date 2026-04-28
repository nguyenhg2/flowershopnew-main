import axiosClient from './axiosClient';

const authApi = {
  login(email, password) {
    return axiosClient.post('/api/auth/login', { email, password });
  },
  register(data) {
    return axiosClient.post('/api/auth/register', data);
  },
  getMe() {
    return axiosClient.get('/api/users/me');
  },
  updateProfile(data) {
    return axiosClient.put('/api/users/me', data);
  },
  changePassword(oldPassword, newPassword) {
    return axiosClient.put('/api/users/me/password', { oldPassword, newPassword });
  }
};

export default authApi;
