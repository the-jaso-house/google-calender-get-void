/**
 * Session endpoint - Returns current user session info
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCookie } from '@/lib/session';
import { setCredentials, getOAuth2Client } from '@/lib/google-auth';
import { getUserEmail } from '@/lib/calendar-client';

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie');
    const tokens = getTokensFromCookie(cookieHeader);

    if (!tokens) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      );
    }

    // Get user email
    try {
      const oauth2Client = getOAuth2Client();
      setCredentials(oauth2Client, tokens);
      const email = await getUserEmail(oauth2Client);

      return NextResponse.json({
        isAuthenticated: true,
        email,
      });
    } catch (error) {
      console.error('Failed to get user info:', error);
      return NextResponse.json(
        { isAuthenticated: true, email: 'unknown' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 200 }
    );
  }
}
