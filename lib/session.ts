/**
 * Session management utilities
 *
 * Token Storage Strategy:
 * - Store tokens in httpOnly cookies for security (prevents XSS attacks)
 * - Encrypt sensitive data before storing
 * - For production, consider using a database-backed session store
 *
 * Why httpOnly cookies?
 * - XSS protection: JavaScript cannot access httpOnly cookies
 * - Automatic transmission: Browser sends cookies with every request
 * - Simple implementation: No need for complex state management
 *
 * Production considerations:
 * - Use a database (Redis, PostgreSQL) for session storage
 * - Implement session expiration and refresh logic
 * - Add CSRF protection
 * - Use secure cookie settings in production (secure: true, sameSite: 'strict')
 */

import { serialize, parse } from 'cookie';
import { TokenInfo } from '@/types/calendar';

const TOKEN_COOKIE_NAME = 'google_tokens';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Simple encryption/decryption for tokens
 * In production, use a proper encryption library like @noble/ciphers or crypto-js
 */
function encryptToken(token: TokenInfo): string {
  // For development: base64 encoding
  // PRODUCTION WARNING: Use proper encryption (AES-256-GCM)
  return Buffer.from(JSON.stringify(token)).toString('base64');
}

function decryptToken(encrypted: string): TokenInfo | null {
  try {
    // For development: base64 decoding
    // PRODUCTION WARNING: Use proper decryption
    const json = Buffer.from(encrypted, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to decrypt token:', error);
    return null;
  }
}

/**
 * Create a cookie string for storing tokens
 */
export function createTokenCookie(tokens: TokenInfo): string {
  const encrypted = encryptToken(tokens);

  return serialize(TOKEN_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: MAX_AGE,
    path: '/',
  });
}

/**
 * Parse tokens from cookie string
 */
export function getTokensFromCookie(cookieHeader: string | null): TokenInfo | null {
  if (!cookieHeader) return null;

  const cookies = parse(cookieHeader);
  const encryptedToken = cookies[TOKEN_COOKIE_NAME];

  if (!encryptedToken) return null;

  return decryptToken(encryptedToken);
}

/**
 * Create a cookie string for clearing tokens (logout)
 */
export function clearTokenCookie(): string {
  return serialize(TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Check if user is authenticated from request headers
 */
export function isAuthenticated(cookieHeader: string | null): boolean {
  const tokens = getTokensFromCookie(cookieHeader);
  return tokens !== null && !!tokens.access_token;
}
