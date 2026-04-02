import ApiClient from './ApiClient';

const ApiUser = {
  syncUser: (data) => ApiClient.post('/User/sync', data),
  getCurrentUser: () => ApiClient.get('/User/me'),
  getUsers: (params) => ApiClient.get('/User', { params }),
  getUser: (id) => ApiClient.get(`/User/${id}`),
  updateUser: (id, data) => ApiClient.put(`/User/${id}`, data),
  deleteUser: (id) => ApiClient.delete(`/User/${id}`),
  verifyUser: (id, isVerified) => ApiClient.patch(`/User/${id}/verify`, null, { params: { isVerified } }),
  toggleStudentStatus: (id, isStudent) => ApiClient.patch(`/User/${id}/student`, null, { params: { isStudent } }),
};

export default ApiUser;
