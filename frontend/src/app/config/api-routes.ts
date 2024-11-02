const isProd = false; // Toggle this to switch environments

const BACKEND_URL = isProd 
  ? 'https://modest-intuition-production.up.railway.app'
  : 'http://localhost:3000';

const BASE_URL = `${BACKEND_URL}/api`;

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
  },
  CHAT: {
    GET_MESSAGES: `${BASE_URL}/projects/:projectId/messages`,
    SEND_MESSAGE: `${BASE_URL}/projects/:projectId/messages`,
  },
  EMAIL: {
    SEND_PROJECT_NOTIFICATION : `${BASE_URL}/email/project-notification`,
  }
};

export const SOCKET_URL = BACKEND_URL;

// Helper functions to replace URL parameters
export const replaceUrlParams = {
  userId: (url: string, userId: string) => url.replace(':userId', userId),
  projectId: (url: string, projectId: string) => url.replace(':projectId', projectId),
};