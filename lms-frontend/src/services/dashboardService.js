import api from './api';

export const dashboardService = {
  // Admin KPI metrics
  getAdminMetrics: async () => {
    const response = await api.get('/dashboard/admin/metrics');
    return response.data.data;
  },

  // 30-day leads vs bookings trend
  getAdminTrends: async (days = 30) => {
    const response = await api.get('/dashboard/admin/trends', { params: { days } });
    return response.data.data;
  },

  // Lead source distribution
  getSourceDistribution: async () => {
    const response = await api.get('/dashboard/admin/source-distribution');
    return response.data.data;
  },

  // Property performance matrix
  getPropertyPerformance: async () => {
    const response = await api.get('/dashboard/admin/property-performance');
    return response.data.data;
  },

  // Telecaller scoped KPI metrics
  getTelecallerDashboard: async () => {
    const response = await api.get('/dashboard/telecaller');
    return response.data.data;
  },
};

export default dashboardService;
