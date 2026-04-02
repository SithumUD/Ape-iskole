import ApiClient from './ApiClient';

const ApiEvent = {
  /**
   * Get list of approved events
   * @param {Object} params - { search, category, startDate, endDate }
   */
  getEvents: (params) => ApiClient.get('/Event', { params }),

  /**
   * Get event details by ID
   * @param {string} id 
   */
  getEvent: (id) => ApiClient.get(`/Event/${id}`),

  /**
   * Get upcoming events
   * @param {number} count 
   */
  getUpcomingEvents: (count = 5) => ApiClient.get('/Event/upcoming', { params: { count } }),

  /**
   * Get admin events (SuperAdmin/SchoolAdmin only)
   * @param {string} schoolId - Optional school ID filter
   */
  getAdminEvents: (schoolId) => ApiClient.get('/Event/admin', { params: { schoolId } }),

  /**
   * Create a new event (SchoolAdmin only)
   * @param {Object} data - CreateEventRequest
   */
  createEvent: (data) => ApiClient.post('/Event', data),

  /**
   * Update event details (SchoolAdmin only)
   * @param {string} id 
   * @param {Object} data - CreateEventRequest
   */
  updateEvent: (id, data) => ApiClient.put(`/Event/${id}`, data),

  /**
   * Delete an event (SuperAdmin/SchoolAdmin only)
   * @param {string} id 
   */
  deleteEvent: (id) => ApiClient.delete(`/Event/${id}`),

  /**
   * Approve or reject an event (SuperAdmin only)
   * @param {string} id 
   * @param {boolean} isApproved 
   */
  approveEvent: (id, isApproved) => ApiClient.patch(`/Event/${id}/approve`, isApproved, {
    headers: {
      'Content-Type': 'application/json',
    },
  }),

  /**
   * Increment view count for an event
   * @param {string} id
   */
  incrementView: (id) => ApiClient.patch(`/Event/${id}/view`),
};

export default ApiEvent;
