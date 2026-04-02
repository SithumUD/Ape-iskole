import ApiClient from './ApiClient';

const ApiPublic = {
  /**
   * Get aggregated home page data from the backend.
   * Returns stats, topStories, upcomingEvents, and featuredSchools.
   * No authentication required.
   */
  getHomeData: () => ApiClient.get('/School/home'),
};

export default ApiPublic;
