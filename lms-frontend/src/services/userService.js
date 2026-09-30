import api from './api';

export const userService = {
  // Get all users
  getUsers: async (role) => {
    const response = await api.get('/users', { params: { role } });
    return response.data.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data.data;
  },

  // Toggle user active status
  toggleStatus: async (id, active) => {
    const response = await api.patch(`/users/${id}/status`, { active });
    return response.data.data;
  },

  // Reset/Change user password (by Super Admin/Admin)
  resetPassword: async (id, newPassword) => {
    const response = await api.patch(`/users/${id}/password`, { newPassword });
    return response.data.data;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data.data;
  },
};

export default userService;
