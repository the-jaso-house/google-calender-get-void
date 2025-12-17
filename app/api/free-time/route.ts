/**
 * Free time calculation endpoint
 *
 * POST /api/free-time
 * Request body: FreeTimeRequest
 * Response: FreeTimeResponse
 */

import { NextRequest, NextResponse } from 'next/server';
import { DateTime } from 'luxon';
import { getTokensFromCookie } from '@/lib/session';
import { setCredentials, getOAuth2Client } from '@/lib/google-auth';
import { getFreeBusySlots } from '@/lib/calendar-client';
import { calculateFreeTime } from '@/lib/free-time-calculator';
import { FreeTimeRequest, FreeTimeResponse } from '@/types/calendar';

/**
 * Validate FreeTimeRequest
 */
function validateRequest(data: any): { valid: boolean; error?: string } {
  if (!data.calendarId || typeof data.calendarId !== 'string') {
    return { valid: false, error: 'Invalid calendarId' };
  }

  if (!data.startDate || !data.endDate) {
    return { valid: false, error: 'Missing startDate or endDate' };
  }

  if (!data.workStartTime || !data.workEndTime) {
    return { valid: false, error: 'Missing workStartTime or workEndTime' };
  }

  if (typeof data.minFreeMinutes !== 'number' || data.minFreeMinutes < 0) {
    return { valid: false, error: 'Invalid minFreeMinutes' };
  }

  if (!data.timezone || typeof data.timezone !== 'string') {
    return { valid: false, error: 'Invalid timezone' };
  }

  // Validate date formats
  const startDate = DateTime.fromISO(data.startDate);
  const endDate = DateTime.fromISO(data.endDate);

  if (!startDate.isValid || !endDate.isValid) {
    return { valid: false, error: 'Invalid date format (use YYYY-MM-DD)' };
  }

  if (startDate > endDate) {
    return { valid: false, error: 'startDate must be before or equal to endDate' };
  }

  // Validate time formats (HH:mm)
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timeRegex.test(data.workStartTime) || !timeRegex.test(data.workEndTime)) {
    return { valid: false, error: 'Invalid time format (use HH:mm)' };
  }

  return { valid: true };
}

export async function POST(request: NextRequest) {
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

    // Parse and validate request body
    const body = await request.json();
    const validation = validateRequest(body);

    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const freeTimeRequest: FreeTimeRequest = body;

    // Set up Google Calendar client
    const oauth2Client = getOAuth2Client();
    setCredentials(oauth2Client, tokens);

    // Convert dates to ISO strings for Google Calendar API
    // FreeBusy API expects UTC timestamps
    const startDateTime = DateTime.fromISO(freeTimeRequest.startDate, {
      zone: freeTimeRequest.timezone,
    }).startOf('day');

    const endDateTime = DateTime.fromISO(freeTimeRequest.endDate, {
      zone: freeTimeRequest.timezone,
    }).endOf('day');

    // Fetch busy slots from Google Calendar
    const busySlots = await getFreeBusySlots(
      oauth2Client,
      freeTimeRequest.calendarId,
      startDateTime.toUTC().toISO()!,
      endDateTime.toUTC().toISO()!
    );

    // Calculate free time slots
    const freeSlots = calculateFreeTime(busySlots, freeTimeRequest);

    const response: FreeTimeResponse = {
      freeSlots,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Free time calculation error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to calculate free time';

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
