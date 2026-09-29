import axios from 'axios';
import type { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const createApiClient = (token?: string): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests if available
  if (token) {
    client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // For dev, also accept X-User-ID header
  if (import.meta.env.DEV && import.meta.env.VITE_USER_ID) {
    client.defaults.headers.common['X-User-ID'] = import.meta.env.VITE_USER_ID;
  }

  return client;
};

export const api = createApiClient();

// Export API services
export * from './services/dorms';
export * from './services/messages';
export * from './services/reports';
