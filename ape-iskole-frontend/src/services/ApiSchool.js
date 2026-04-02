import ApiClient from './ApiClient';

const ApiSchool = {
  /**
   * Register a new school
   * @param {Object} data - CreateSchoolRequest
   */
  registerSchool: (data) => ApiClient.post('/School', data),

  /**
   * Get paged list of schools (SuperAdmin only)
   * @param {Object} params - { searchTerm, type, isActive, pageNumber, pageSize }
   */
  getSchools: (params) => ApiClient.get('/School', { params }),

  /**
   * Get public list of schools (Public access)
   * @param {Object} params - { searchTerm, type, city, pageNumber, pageSize }
   */
  getPublicSchools: (params) => ApiClient.get('/School/public', { params }),

  /**
   * Get school details by ID
   * @param {string} id 
   */
  getSchool: (id) => ApiClient.get(`/School/${id}`),

  /**
   * Update school details
   * @param {string} id 
   * @param {Object} data - UpdateSchoolRequest
   */
  updateSchool: (id, data) => ApiClient.put(`/School/${id}`, data),

  /**
   * Update school images (logo, cover, gallery)
   * @param {string} id 
   * @param {FormData} formData - Multi-part form data containing files
   */
  updateImages: (id, formData) => ApiClient.patch(`/School/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),

  /**
   * Soft delete a school
   * @param {string} id 
   */
  softDeleteSchool: (id) => ApiClient.delete(`/School/${id}/soft`),

  /**
   * Approve a pending school (SuperAdmin/Staff only)
   * @param {string} id 
   */
  approveSchool: (id) => ApiClient.patch(`/School/${id}/approve`),

  /**
   * Reject a pending school (SuperAdmin/Staff only)
   * @param {string} id 
   * @param {string} reason 
   */
  rejectSchool: (id, reason) => ApiClient.patch(`/School/${id}/reject`, null, {
    params: { reason }
  }),

  /**
   * Create a user for a specific school (SuperAdmin only)
   * @param {string} id - School ID
   * @param {Object} data - CreateSchoolUserRequest
   */
  createSchoolUser: (id, data) => ApiClient.post(`/School/${id}/users`, data),

  /**
   * Toggle active status of a school (SuperAdmin only)
   * @param {string} id 
   * @param {boolean} isActive 
   */
  toggleActiveStatus: (id, isActive) => ApiClient.patch(`/School/${id}/active`, null, { 
    params: { isActive } 
  }),

  /**
   * Get dashboard stats for the current school admin's school
   */
  getDashboardStats: () => ApiClient.get('/School/dashboard/stats'),
};

export default ApiSchool;
