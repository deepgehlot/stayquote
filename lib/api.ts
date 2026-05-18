/**
 * API configuration and utility functions for making requests
 * to the backend server.
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://hotel-qr-api.vercel.app/api/';

/**
 * Helper to build full API endpoints
 * @param endpoint - The endpoint path (e.g., '/auth/login')
 * @returns The full URL
 */
export const getApiUrl = (endpoint: string): string => {
  // Ensure the base URL ends with a slash and the endpoint doesn't start with one (or vice versa)
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`;
  const path = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${base}${path}`;
};
