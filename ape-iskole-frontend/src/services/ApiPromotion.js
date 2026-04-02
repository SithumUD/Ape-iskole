import ApiClient from './ApiClient';

const ApiPromotion = {
  /**
   * Get all active promotions for public users
   */
  getAllActive: () => ApiClient.get('/Promotion'),

  /**
   * Get all promotions for admin (includes inactive)
   */
  getAllAdmin: () => ApiClient.get('/Promotion/admin'),

  /**
   * Get promotion by ID
   * @param {string} id 
   */
  getById: (id) => ApiClient.get(`/Promotion/${id}`),

  /**
   * Create a new promotion
   * @param {Object} data 
   */
  create: (data) => ApiClient.post('/Promotion', data),

  /**
   * Update an existing promotion
   * @param {string} id 
   * @param {Object} data 
   */
  update: (id, data) => ApiClient.put(`/Promotion/${id}`, data),

  /**
   * Delete a promotion
   * @param {string} id 
   */
  delete: (id) => ApiClient.delete(`/Promotion/${id}`),

  /**
   * Claim a promotion (increments uses)
   * @param {string} id 
   */
  claim: (id) => ApiClient.post(`/Promotion/${id}/claim`)
};

export default ApiPromotion;
