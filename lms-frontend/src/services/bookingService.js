import api from './api';

export const bookingService = {
  // Get all bookings (paginated & filtered)
  getBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params });
    return response.data.data;
  },

  // Create booking (convert from lead or direct)
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data.data;
  },

  // Get booking details
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data.data;
  },

  // Get booking by booking number
  getBookingByNumber: async (bookingNumber) => {
    const response = await api.get(`/bookings/number/${bookingNumber}`);
    return response.data.data;
  },

  // Record payment (advance or balance)
  recordPayment: async (bookingId, paymentData) => {
    const response = await api.patch(`/bookings/${bookingId}/payment`, paymentData);
    return response.data.data;
  },

  // Update booking status
  updateStatus: async (bookingId, status) => {
    const response = await api.patch(`/bookings/${bookingId}/status`, { status });
    return response.data.data;
  },

  // 360 Customer Profile
  getCustomer360Profile: async (query) => {
    const response = await api.get('/bookings/customers/360', { params: { query } });
    return response.data.data;
  },

  // Get Room Availability
  getRoomAvailability: async (propertyId, checkInDate, checkOutDate) => {
    const response = await api.get('/bookings/room-availability', {
      params: { propertyId, checkInDate, checkOutDate }
    });
    return response.data.data;
  },
};

export default bookingService;
