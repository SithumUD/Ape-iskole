import ApiClient from './ApiClient';

const ApiStory = {
  /**
   * Get paged list of stories
   * @param {Object} params - { searchTerm, category, schoolId, tag, isPublished, pageNumber, pageSize }
   */
  getStories: (params) => ApiClient.get('/Story', { params }),

  /**
   * Get story details by ID
   * @param {string} id 
   */
  getStory: (id) => ApiClient.get(`/Story/${id}`),

  /**
   * Create a new story (SuperAdmin/SchoolAdmin only)
   * @param {Object} data - CreateStoryRequest
   */
  createStory: (data) => ApiClient.post('/Story', data),

  /**
   * Update story details (SuperAdmin/SchoolAdmin only)
   * @param {string} id 
   * @param {Object} data - UpdateStoryRequest
   */
  updateStory: (id, data) => ApiClient.put(`/Story/${id}`, data),

  /**
   * Upload/Update story image
   * @param {string} id 
   * @param {File} image 
   */
  uploadImage: (id, image) => {
    const formData = new FormData();
    formData.append('image', image);
    return ApiClient.patch(`/Story/${id}/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  /**
   * Delete a story (SuperAdmin/SchoolAdmin only)
   * @param {string} id 
   */
  deleteStory: (id) => ApiClient.delete(`/Story/${id}`),

  /**
   * Like a story
   * @param {string} id 
   */
  likeStory: (id) => ApiClient.post(`/Story/${id}/like`),
};

export default ApiStory;
