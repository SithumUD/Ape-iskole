import ApiClient from './ApiClient';

const ApiAnnouncement = {
  /**
   * Get community announcements
   */
  getCommunity: () => ApiClient.get('/Announcement'),

  /**
   * Get public announcements for a specific school
   * @param {string} schoolId 
   */
  getPublicForSchool: (schoolId) => ApiClient.get(`/Announcement/school/${schoolId}`),

  /**
   * Get admin announcements for a school (SchoolAdmin/SuperAdmin only)
   * @param {string} schoolId 
   */
  getAdminAnnouncements: (schoolId) => ApiClient.get(`/Announcement/admin/${schoolId}`),

  /**
   * Get announcement by ID
   * @param {string} id 
   */
  getAnnouncement: (id) => ApiClient.get(`/Announcement/${id}`),

  /**
   * Create a new announcement (SchoolAdmin only)
   * @param {Object} data 
   */
  createAnnouncement: (data) => ApiClient.post('/Announcement', data),

  /**
   * Delete an announcement (SchoolAdmin/SuperAdmin only)
   * @param {string} id 
   */
  deleteAnnouncement: (id) => ApiClient.delete(`/Announcement/${id}`),
};

export default ApiAnnouncement;
