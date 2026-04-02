import ApiClient from './ApiClient';

const ApiTicket = {
  /**
   * Purchase a ticket for an event
   * @param {Object} data - PurchaseTicketRequest
   */
  purchaseTicket: (data) => ApiClient.post('/Ticket/purchase', data),

  /**
   * Get pending ticket verifications for a school (SchoolAdmin only)
   * @param {string} schoolId 
   */
  getPendingVerifications: (schoolId) => ApiClient.get('/Ticket/pending-verifications', { params: { schoolId } }),

  /**
   * Verify ticket payment (SchoolAdmin only)
   * @param {string} id - Ticket purchase ID
   * @param {Object} data - { isApproved }
   */
  verifyPayment: (id, data) => ApiClient.patch(`/Ticket/verify/${id}`, data),
};

export default ApiTicket;
