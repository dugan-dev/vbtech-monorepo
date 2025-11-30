/**
 * Rate limiting constants used across the application
 */

// Page and API rate limiting configuration
export const PAGE_RATE_LIMIT = {
  POINTS: 30, // Number of requests
  DURATION: 30, // Time window in seconds
  BLOCK_DURATION: 60, // Block duration in seconds
} as const;

// Authenticated user action rate limiting
export const AUTHED_ACTION_RATE_LIMIT = {
  POINTS: 30, // Number of requests
  DURATION: 30, // Time window in seconds
  BLOCK_DURATION: 180, // Block duration in seconds (3 minutes)
} as const;

// Unauthenticated user action rate limiting
export const UNAUTHED_ACTION_RATE_LIMIT = {
  POINTS: 10, // Number of requests
  DURATION: 30, // Time window in seconds
  BLOCK_DURATION: 60, // Block duration in seconds (1 minute)
} as const;

// Read-only action rate limiting (for cached lookups/validations)
export const READ_ONLY_ACTION_RATE_LIMIT = {
  POINTS: 100, // Number of requests (higher limit for read-only operations)
  DURATION: 30, // Time window in seconds
  BLOCK_DURATION: 60, // Block duration in seconds (1 minute)
} as const;
