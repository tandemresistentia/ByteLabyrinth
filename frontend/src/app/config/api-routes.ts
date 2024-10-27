const BASE_URL = 'http://localhost:3000/api'; // Replace with your actual API base URL

export const API_ROUTES = {
  AUTH: {
    SIGNUP: `${BASE_URL}/auth/signup`,
    LOGIN: `${BASE_URL}/auth/login`,
  },
  PROJECTS: {
    CREATE: `${BASE_URL}/create`,
    BASE: `${BASE_URL}/projects`,
    USER_PROJECTS: `${BASE_URL}/projects/user/:userId`,
    PARTICIPANT_PROJECTS: `${BASE_URL}/projects/participant/:userId`,
    UPDATE_STATUS: `${BASE_URL}/projects/:projectId/status`,
    // Add more project-related routes as needed
  },
  CHAT: {
    GET_MESSAGES: `${BASE_URL}/projects/:projectId/messages`,
    SEND_MESSAGE: `${BASE_URL}/projects/:projectId/messages`,
  }
  // Add more categories of routes as your API grows
};

export const SOCKET_URL = 'http://localhost:3000'; // WebSocket server URL