/**
 * Free time calculation logic
 *
 * This module calculates free time slots based on:
 * - Busy slots from Google Calendar
 * - Working hours constraints
 * - Minimum free time duration
 * - Timezone considerations (including DST)
 */

import { DateTime, Interval } from 'luxon';
import { BusySlot, FreeSlot, FreeTimeRequest } from '@/types/calendar';

/**
 * Merge overlapping or adjacent busy slots
 *
 * This is crucial for correct free time calculation when events overlap
 * or are back-to-back.
 *
 * Algorithm:
 * 1. Sort slots by start time
 * 2. Merge overlapping/adjacent slots
 */
function mergeBusySlots(busySlots: BusySlot[]): BusySlot[] {
  if (busySlots.length === 0) return [];

  // Sort by start time
  const sorted = [...busySlots].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const merged: BusySlot[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const lastMerged = merged[merged.length - 1];

    const lastEnd = new Date(lastMerged.end).getTime();
    const currentStart = new Date(current.start).getTime();

    // If current slot overlaps or is adjacent to last merged slot
    if (currentStart <= lastEnd) {
      // Extend the last merged slot if current extends beyond it
      const currentEnd = new Date(current.end).getTime();
      if (currentEnd > lastEnd) {
        lastMerged.end = current.end;
      }
    } else {
      // No overlap, add as new slot
      merged.push(current);
    }
  }

  return merged;
}

/**
 * Calculate free time slots for a single day
 */
function calculateFreeSlotsForDay(
  date: DateTime,
  busySlots: BusySlot[],
  workStartTime: string,
  workEndTime: string,
  minFreeMinutes: number,
  timezone: string
): FreeSlot[] {
  const freeSlots: FreeSlot[] = [];

  // Parse work hours (e.g., '09:00' -> hour: 9, minute: 0)
  const [workStartHour, workStartMinute] = workStartTime.split(':').map(Number);
  const [workEndHour, workEndMinute] = workEndTime.split(':').map(Number);

  // Create work start and end DateTime for this day
  const workStart = date.set({
    hour: workStartHour,
    minute: workStartMinute,
    second: 0,
    millisecond: 0,
  });

  const workEnd = date.set({
    hour: workEndHour,
    minute: workEndMinute,
    second: 0,
    millisecond: 0,
  });

  // Filter busy slots that intersect with this day's working hours
  const relevantBusySlots = busySlots
    .map((slot) => ({
      start: DateTime.fromISO(slot.start, { zone: timezone }),
      end: DateTime.fromISO(slot.end, { zone: timezone }),
    }))
    .filter((slot) => {
      // Check if busy slot intersects with work hours
      return slot.end > workStart && slot.start < workEnd;
    })
    .map((slot) => ({
      // Clamp busy slot to work hours
      start: slot.start < workStart ? workStart : slot.start,
      end: slot.end > workEnd ? workEnd : slot.end,
    }))
    .sort((a, b) => a.start.toMillis() - b.start.toMillis());

  // Calculate free slots between busy slots
  let currentTime = workStart;

  for (const busySlot of relevantBusySlots) {
    // If there's a gap between current time and next busy slot
    if (busySlot.start > currentTime) {
      const gapMinutes = busySlot.start.diff(currentTime, 'minutes').minutes;

      if (gapMinutes >= minFreeMinutes) {
        freeSlots.push({
          start: currentTime.toISO()!,
          end: busySlot.start.toISO()!,
          durationMinutes: Math.floor(gapMinutes),
          date: date.toISODate()!,
        });
      }
    }

    // Move current time to end of busy slot
    currentTime = busySlot.end > currentTime ? busySlot.end : currentTime;
  }

  // Check if there's free time after the last busy slot until work end
  if (currentTime < workEnd) {
    const remainingMinutes = workEnd.diff(currentTime, 'minutes').minutes;

    if (remainingMinutes >= minFreeMinutes) {
      freeSlots.push({
        start: currentTime.toISO()!,
        end: workEnd.toISO()!,
        durationMinutes: Math.floor(remainingMinutes),
        date: date.toISODate()!,
      });
    }
  }

  return freeSlots;
}

/**
 * Main function to calculate free time slots
 *
 * @param busySlots - Array of busy time slots from Google Calendar
 * @param request - Free time request parameters
 * @returns Array of free time slots
 */
export function calculateFreeTime(
  busySlots: BusySlot[],
  request: FreeTimeRequest
): FreeSlot[] {
  const {
    startDate,
    endDate,
    workStartTime,
    workEndTime,
    minFreeMinutes,
    timezone,
  } = request;

  // Merge overlapping busy slots first
  const mergedBusySlots = mergeBusySlots(busySlots);

  // Parse date range
  const start = DateTime.fromISO(startDate, { zone: timezone });
  const end = DateTime.fromISO(endDate, { zone: timezone });

  if (!start.isValid || !end.isValid) {
    throw new Error('Invalid date format');
  }

  if (start > end) {
    throw new Error('Start date must be before or equal to end date');
  }

  // Calculate free slots for each day in the range
  const allFreeSlots: FreeSlot[] = [];
  let currentDate = start.startOf('day');

  while (currentDate <= end.endOf('day')) {
    const dayFreeSlots = calculateFreeSlotsForDay(
      currentDate,
      mergedBusySlots,
      workStartTime,
      workEndTime,
      minFreeMinutes,
      timezone
    );

    allFreeSlots.push(...dayFreeSlots);
    currentDate = currentDate.plus({ days: 1 });
  }

  return allFreeSlots;
}

/**
 * Group free slots by date for easier display
 */
export function groupFreeSlotsByDate(freeSlots: FreeSlot[]): Record<string, FreeSlot[]> {
  const grouped: Record<string, FreeSlot[]> = {};

  for (const slot of freeSlots) {
    if (!grouped[slot.date]) {
      grouped[slot.date] = [];
    }
    grouped[slot.date].push(slot);
  }

  return grouped;
}

/**
 * Format free slot for display
 *
 * Example: "2025-12-17 13:00-14:00 (60分)"
 */
export function formatFreeSlot(slot: FreeSlot, timezone: string): string {
  const start = DateTime.fromISO(slot.start, { zone: timezone });
  const end = DateTime.fromISO(slot.end, { zone: timezone });

  const startTime = start.toFormat('HH:mm');
  const endTime = end.toFormat('HH:mm');
  const date = start.toFormat('yyyy-MM-dd');

  return `${date} ${startTime}-${endTime} (${slot.durationMinutes}分)`;
}
