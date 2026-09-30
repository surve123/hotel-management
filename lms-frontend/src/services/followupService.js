import api from './api';

export const followupService = {
  // Get followup dashboard metrics
  getDashboard: async () => {
    const response = await api.get('/followups/dashboard');
    return response.data.data;
  },

  // Get today's followups
  getToday: async () => {
    const response = await api.get('/followups/today');
    return response.data.data;
  },

  // Get overdue followups
  getOverdue: async () => {
    const response = await api.get('/followups/overdue');
    return response.data.data;
  },

  // Get calendar events range
  getCalendarEvents: async (start, end) => {
    const response = await api.get('/followups/calendar', {
      params: { start, end },
    });
    return response.data.data;
  },

  // Get history
  getHistory: async () => {
    const response = await api.get('/followups/history');
    return response.data.data;
  },

  // Reschedule follow-up
  reschedule: async (id, nextFollowupDate, remarks) => {
    const response = await api.patch(`/followups/${id}/reschedule`, {
      nextFollowupDate,
      remarks,
    });
    return response.data.data;
  },
};

export default followupService;
