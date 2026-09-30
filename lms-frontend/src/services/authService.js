import api, { TOKEN_KEY, REFRESH_TOKEN_KEY } from './api';

export const authService = {
  /**
   * Authenticate user with username/email and password
   * @param {Object} credentials - { usernameOrEmail, password }
   * @returns {Promise<Object>} AuthResponse data with tokens and user info
   */
  async login({ usernameOrEmail, password }) {
    const response = await api.post('/auth/login', {
      usernameOrEmail,
      password,
    });
    
    // Spring Boot returns { success: true, message: "...", data: { accessToken, ... } }
    const authData = response.data?.data || response.data;
    
    if (authData?.accessToken) {
      localStorage.setItem(TOKEN_KEY, authData.accessToken);
    }
    if (authData?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
    }

    return authData;
  },

  /**
   * Refresh JWT token pair
   */
  async refreshToken(refreshToken) {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    const authData = response.data?.data || response.data;

    if (authData?.accessToken) {
      localStorage.setItem(TOKEN_KEY, authData.accessToken);
    }
    if (authData?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, authData.refreshToken);
    }

    return authData;
  },

  /**
   * Get current authenticated user profile
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data?.data || response.data;
  },

  /**
   * Change user password
   */
  async changePassword({ currentPassword, newPassword }) {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Clear all authentication tokens and state
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

export default authService;
