/**
 * Calendar list endpoint
 *
 * GET /api/calendars
 * Returns list of user's calendars
 */

import { NextRequest, NextResponse } from 'next/server';
import { getTokensFromCookie } from '@/lib/session';
import { setCredentials, getOAuth2Client } from '@/lib/google-auth';
import { listCalendars } from '@/lib/calendar-client';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const cookieHeader = request.headers.get('cookie');
    const tokens = getTokensFromCookie(cookieHeader);

    if (!tokens) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Set up Google Calendar client
    const oauth2Client = getOAuth2Client();
    setCredentials(oauth2Client, tokens);

    // Fetch calendar list
    const calendars = await listCalendars(oauth2Client);

    return NextResponse.json({ calendars });
  } catch (error) {
    console.error('Calendar list error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch calendar list';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
