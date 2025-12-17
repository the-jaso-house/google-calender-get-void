/**
 * Type definitions for Google Calendar Free Time Application
 */

/**
 * Represents a busy time slot from Google Calendar
 */
export interface BusySlot {
  start: string; // ISO 8601 datetime string
  end: string;   // ISO 8601 datetime string
}

/**
 * Represents a free time slot
 */
export interface FreeSlot {
  start: string;       // ISO 8601 datetime string
  end: string;         // ISO 8601 datetime string
  durationMinutes: number; // Duration in minutes
  date: string;        // YYYY-MM-DD format
}

/**
 * Form inputs for free time calculation
 */
export interface FreeTimeRequest {
  calendarId: string;       // Calendar ID (e.g., 'primary')
  startDate: string;        // YYYY-MM-DD format
  endDate: string;          // YYYY-MM-DD format
  workStartTime: string;    // HH:mm format (e.g., '09:00')
  workEndTime: string;      // HH:mm format (e.g., '18:00')
  minFreeMinutes: number;   // Minimum free time duration in minutes
  timezone: string;         // IANA timezone (e.g., 'Asia/Tokyo')
}

/**
 * Response from free time API
 */
export interface FreeTimeResponse {
  freeSlots: FreeSlot[];
  error?: string;
}

/**
 * Grouped free slots by date
 */
export interface GroupedFreeSlots {
  [date: string]: FreeSlot[]; // date in YYYY-MM-DD format
}

/**
 * OAuth token information
 */
export interface TokenInfo {
  access_token: string;
  refresh_token?: string;
  expiry_date?: number;
  token_type: string;
  scope: string;
}

/**
 * User session information
 */
export interface UserSession {
  email?: string;
  isAuthenticated: boolean;
}
