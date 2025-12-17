/**
 * Google Calendar API client
 */

import { google, calendar_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { BusySlot } from '@/types/calendar';

/**
 * Fetch busy time slots from Google Calendar using FreeBusy API
 *
 * Why FreeBusy API?
 * - Designed specifically for availability checks
 * - More efficient than Events.list (doesn't return full event details)
 * - Better for privacy (only returns busy/free status, no event titles/descriptions)
 * - Handles multiple calendars in a single request
 */
export async function getFreeBusySlots(
  oauth2Client: OAuth2Client,
  calendarId: string,
  timeMin: string,
  timeMax: string
): Promise<BusySlot[]> {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        items: [{ id: calendarId }],
        timeZone: 'UTC', // Request in UTC, we'll convert later
      },
    });

    const busySlots = response.data.calendars?.[calendarId]?.busy || [];

    return busySlots.map((slot) => ({
      start: slot.start!,
      end: slot.end!,
    }));
  } catch (error) {
    console.error('Error fetching freebusy data:', error);
    throw new Error('Failed to fetch calendar data from Google Calendar API');
  }
}

/**
 * Get user's email address
 */
export async function getUserEmail(oauth2Client: OAuth2Client): Promise<string> {
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });

  try {
    const response = await oauth2.userinfo.get();
    return response.data.email || 'unknown';
  } catch (error) {
    console.error('Error fetching user info:', error);
    return 'unknown';
  }
}

/**
 * List available calendars for the user
 */
export async function listCalendars(
  oauth2Client: OAuth2Client
): Promise<Array<{ id: string; summary: string }>> {
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    const response = await calendar.calendarList.list();
    const calendars = response.data.items || [];

    return calendars.map((cal) => ({
      id: cal.id!,
      summary: cal.summary || cal.id!,
    }));
  } catch (error) {
    console.error('Error fetching calendar list:', error);
    throw new Error('Failed to fetch calendar list');
  }
}
