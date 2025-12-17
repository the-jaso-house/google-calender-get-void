/**
 * OAuth callback endpoint - Handles Google OAuth redirect
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOAuth2Client, getTokensFromCode } from '@/lib/google-auth';
import { createTokenCookie } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    // Validate authorization code
    if (!code) {
      return NextResponse.redirect(
        new URL('/login?error=missing_code', request.url)
      );
    }

    // Exchange code for tokens
    const oauth2Client = getOAuth2Client();
    const tokens = await getTokensFromCode(oauth2Client, code);

    // Create session cookie
    const cookie = createTokenCookie({
      access_token: tokens.access_token!,
      refresh_token: tokens.refresh_token || undefined,
      expiry_date: tokens.expiry_date || undefined,
      token_type: tokens.token_type || 'Bearer',
      scope: tokens.scope || '',
    });

    // Redirect to app with cookie set
    const response = NextResponse.redirect(new URL('/app', request.url));
    response.headers.set('Set-Cookie', cookie);

    return response;
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.redirect(
      new URL('/login?error=authentication_failed', request.url)
    );
  }
}
