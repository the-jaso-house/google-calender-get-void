/**
 * Login endpoint - Redirects to Google OAuth consent screen
 */

import { NextResponse } from 'next/server';
import { getOAuth2Client, getAuthUrl } from '@/lib/google-auth';

export async function GET() {
  try {
    const oauth2Client = getOAuth2Client();
    const authUrl = getAuthUrl(oauth2Client);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate authentication' },
      { status: 500 }
    );
  }
}
