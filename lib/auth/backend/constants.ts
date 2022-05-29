// Below in seconds.
export const ACCESS_TOKEN_MAX_AGE = 60 * 15; // 15 minutes
export const REFRESH_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 1 week

export const TOKEN_CREATED_AT_INDEX_NAME = "Token_createdAt_ttl_index";

// env vars
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
