import ApiClient from './ApiClient';

const ApiAdmin = {
  /**
   * Get all pending content approvals (Events, Stories, Announcements, Donations)
   */
  getPendingApprovals: () => ApiClient.get('/Admin/approvals/pending'),

  /**
   * Get summary counts of pending approvals
   */
  getApprovalSummary: () => ApiClient.get('/Admin/approvals/summary'),

  /**
   * Get comprehensive dashboard stats for super admin
   */
  getDashboardStats: () => ApiClient.get('/Admin/dashboard/stats'),

  /**
   * Approve/Reject an Event
   */
  approveEvent: (id, isApproved) => ApiClient.patch(`/Event/${id}/approve`, { isApproved }),


  /**
   * Approve a Donation
   */
  approveDonation: (id, isApproved) => ApiClient.patch(`/Donation/${id}/approve`, { isApproved }),
};

export default ApiAdmin;
