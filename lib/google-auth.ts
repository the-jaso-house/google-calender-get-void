/**
 * Google OAuth 2.0 authentication utilities
 */

import { google } from 'googleapis';

/**
 * Get OAuth2 client configured with credentials from environment variables
 */
export function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';

  if (!clientId || !clientSecret) {
    throw new Error('Missing Google OAuth credentials in environment variables');
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Generate authorization URL for Google OAuth
 */
export function getAuthUrl(oauth2Client: ReturnType<typeof getOAuth2Client>): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent', // Force consent screen to get refresh token
  });
}

/**
 * Exchange authorization code for tokens
 */
export async function getTokensFromCode(
  oauth2Client: ReturnType<typeof getOAuth2Client>,
  code: string
) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

/**
 * Set credentials on OAuth2 client from stored tokens
 */
export function setCredentials(
  oauth2Client: ReturnType<typeof getOAuth2Client>,
  tokens: any
) {
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}
