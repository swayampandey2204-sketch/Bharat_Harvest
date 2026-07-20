/**
 * Base URL for the backend API.
 * 1. Uses NEXT_PUBLIC_API_URL environment variable if set.
 * 2. If running on client/browser outside localhost (e.g. Vercel deployment), defaults to live Render backend URL.
 * 3. Fallback for local development is http://localhost:5001/api/v1.
 */
export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')
    ? 'https://bharat-harvest-organic.onrender.com/api/v1'
    : 'http://localhost:5001/api/v1')
).replace(/\/$/, '');
