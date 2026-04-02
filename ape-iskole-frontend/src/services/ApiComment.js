import ApiClient from './ApiClient';

const ApiComment = {
  /**
   * Get comments for a story
   * @param {string} storyId 
   */
  getCommentsByStory: (storyId) => ApiClient.get(`/Comment/story/${storyId}`),

  /**
   * Add a comment to a story
   * @param {string} storyId 
   * @param {Object} data - CreateCommentRequest
   */
  addComment: (storyId, data) => ApiClient.post(`/Comment/story/${storyId}`, data),

  /**
   * Delete a comment (Owner or SuperAdmin only)
   * @param {string} id 
   */
  deleteComment: (id) => ApiClient.delete(`/Comment/${id}`),

  /**
   * Like a comment
   * @param {string} id 
   */
  likeComment: (id) => ApiClient.post(`/Comment/${id}/like`),
};

export default ApiComment;
