/**
 * Base URL for the backend API.
 * Uses NEXT_PUBLIC_API_URL environment variable if set (e.g. on Vercel),
 * otherwise defaults to http://localhost:5001/api/v1 for local development.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api/v1'
).replace(/\/$/, '');
