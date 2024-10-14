const BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API base URL

export const API_ROUTES = {
  AUTH: {
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGIN: `${BASE_URL}/auth/login`,
  },
  PROJECTS: {
    CREATE: `${BASE_URL}/create`,
    USER_PROJECTS: `${BASE_URL}/user-projects/:userId`
    // Add more project-related routes as needed
  },
  // Add more categories of routes as your API grows
};