import ApiClient from './ApiClient';

const ApiDonation = {
  /**
   * Get list of approved donations
   * @param {Object} params - { search, category, minGoal, maxGoal, sortBy, pageNumber, pageSize }
   */
  getDonations: (params) => ApiClient.get('/Donation', { params }),

  /**
   * Get donation details by ID
   * @param {string} id 
   */
  getDonation: (id) => ApiClient.get(`/Donation/${id}`),

  /**
   * Get admin donations (SuperAdmin/SchoolAdmin only)
   * @param {Object} params - { search, category, schoolId, isApproved, pageNumber, pageSize }
   */
  getAdminDonations: (params) => ApiClient.get('/Donation/admin', { params }),

  /**
   * Create a new donation (SchoolAdmin only)
   * @param {Object} data - CreateDonationRequest
   */
  createDonation: (data) => ApiClient.post('/Donation', data),

  /**
   * Update donation details (SchoolAdmin only)
   * @param {string} id 
   * @param {Object} data - UpdateDonationRequest
   */
  updateDonation: (id, data) => ApiClient.put(`/Donation/${id}`, data),

  /**
   * Delete a donation (SuperAdmin/SchoolAdmin only)
   * @param {string} id 
   */
  deleteDonation: (id) => ApiClient.delete(`/Donation/${id}`),

  /**
   * Approve a donation (SuperAdmin only)
   * @param {string} id 
   */
  approveDonation: (id) => ApiClient.patch(`/Donation/${id}/approve`),

  /**
   * Toggle featured status of a donation (SuperAdmin only)
   * @param {string} id 
   */
  toggleFeatured: (id) => ApiClient.patch(`/Donation/${id}/featured`),

  /**
   * Add an update to a donation (SchoolAdmin only)
   * @param {string} id 
   * @param {Object} data - AddDonationUpdateRequest
   */
  addDonationUpdate: (id, data) => ApiClient.post(`/Donation/${id}/updates`, data),
};

export default ApiDonation;
