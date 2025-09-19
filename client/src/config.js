// API Configuration
const config = {
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'https://task-manager-new-aol9.onrender.com/api',
  
  // API Endpoints
  endpoints: {
    LOGIN: '/login',
    REGISTER: '/register',
    TASKS: '/tasks',
  },
  
  // Build full API URLs
  getApiUrl: (endpoint) => {
    return `${config.API_BASE_URL}${endpoint}`;
  }
};

export default config;