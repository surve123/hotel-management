import api from './api';

export const propertyService = {
  // Get all properties
  getProperties: async (onlyActive = false) => {
    const response = await api.get('/properties', { params: { onlyActive } });
    return response.data.data;
  },

  // Get property details
  getPropertyById: async (id) => {
    const response = await api.get(`/properties/${id}`);
    return response.data.data;
  },

  // Create property
  createProperty: async (propertyData) => {
    const response = await api.post('/properties', propertyData);
    return response.data.data;
  },

  // Update property
  updateProperty: async (id, propertyData) => {
    const response = await api.put(`/properties/${id}`, propertyData);
    return response.data.data;
  },

  // Delete/Archive property
  deleteProperty: async (id) => {
    const response = await api.delete(`/properties/${id}`);
    return response.data.data;
  },
};

export default propertyService;
