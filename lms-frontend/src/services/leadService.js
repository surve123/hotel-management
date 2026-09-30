import api from './api';

export const leadService = {
  // Get paginated and filtered leads
  getLeads: async (params = {}) => {
    const response = await api.get('/leads', { params });
    return response.data.data;
  },

  // Create new lead
  createLead: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data.data;
  },

  // Get single lead details + full timeline
  getLeadById: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data.data;
  },

  // Update lead
  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data.data;
  },

  // Delete/Archive lead
  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data.data;
  },

  // Update status (NEW, FOLLOW_UP, HOT, BOOKED, CANCELLED)
  updateStatus: async (id, status) => {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return response.data.data;
  },

  // Assign lead to telecaller
  assignLead: async (id, userId) => {
    const response = await api.post(`/leads/${id}/assign`, { userId });
    return response.data.data;
  },

  // Log a call outcome & set next follow-up
  logCall: async (id, callData) => {
    const response = await api.post(`/leads/${id}/call-logs`, callData);
    return response.data.data;
  },

  // Add internal note
  addNote: async (id, note) => {
    const response = await api.post(`/leads/${id}/notes`, { note });
    return response.data.data;
  },
};

export default leadService;
