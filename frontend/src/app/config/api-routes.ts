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
  CHAT: {
    GET_MESSAGES: `${BASE_URL}/chat/:projectId`,
    SEND_MESSAGE: `${BASE_URL}/chat`
  }
  // Add more categories of routes as your API grows
};

export const SOCKET_URL = 'http://localhost:3000'; // WebSocket server URL