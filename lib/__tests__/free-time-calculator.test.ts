/**
 * Unit tests for free time calculator
 */

import { calculateFreeTime, groupFreeSlotsByDate } from '../free-time-calculator';
import { BusySlot, FreeTimeRequest } from '@/types/calendar';
import { DateTime } from 'luxon';

describe('calculateFreeTime', () => {
  const baseRequest: FreeTimeRequest = {
    calendarId: 'primary',
    startDate: '2025-12-17',
    endDate: '2025-12-17',
    workStartTime: '09:00',
    workEndTime: '18:00',
    minFreeMinutes: 30,
    timezone: 'Asia/Tokyo',
  };

  test('should return full day when no busy slots', () => {
    const busySlots: BusySlot[] = [];

    const result = calculateFreeTime(busySlots, baseRequest);

    expect(result).toHaveLength(1);
    expect(result[0].durationMinutes).toBe(540); // 9 hours = 540 minutes
  });

  test('should calculate free time with single busy slot in middle', () => {
    const busySlots: BusySlot[] = [
      {
        start: '2025-12-17T12:00:00+09:00',
        end: '2025-12-17T13:00:00+09:00',
      },
    ];

    const result = calculateFreeTime(busySlots, baseRequest);

    expect(result).toHaveLength(2);
    // Morning: 09:00-12:00 (180 min)
    expect(result[0].durationMinutes).toBe(180);
    // Afternoon: 13:00-18:00 (300 min)
    expect(result[1].durationMinutes).toBe(300);
  });

  test('should merge overlapping busy slots', () => {
    const busySlots: BusySlot[] = [
      {
        start: '2025-12-17T10:00:00+09:00',
        end: '2025-12-17T11:00:00+09:00',
      },
      {
        start: '2025-12-17T10:30:00+09:00',
        end: '2025-12-17T11:30:00+09:00',
      },
    ];

    const result = calculateFreeTime(busySlots, baseRequest);

    expect(result).toHaveLength(2);
    // Morning: 09:00-10:00 (60 min)
    expect(result[0].durationMinutes).toBe(60);
    // Afternoon: 11:30-18:00 (390 min)
    expect(result[1].durationMinutes).toBe(390);
  });

  test('should filter out free slots shorter than minimum', () => {
    const request: FreeTimeRequest = {
      ...baseRequest,
      minFreeMinutes: 60,
    };

    const busySlots: BusySlot[] = [
      {
        start: '2025-12-17T09:00:00+09:00',
        end: '2025-12-17T09:30:00+09:00', // 30 min busy
      },
      // This leaves 30 min free from 09:30-10:00, which should be filtered
      {
        start: '2025-12-17T10:00:00+09:00',
        end: '2025-12-17T11:00:00+09:00',
      },
    ];

    const result = calculateFreeTime(busySlots, request);

    // Only the 11:00-18:00 slot (420 min) should remain
    expect(result).toHaveLength(1);
    expect(result[0].durationMinutes).toBe(420);
  });

  test('should handle busy slots outside work hours', () => {
    const busySlots: BusySlot[] = [
      {
        start: '2025-12-17T07:00:00+09:00', // Before work hours
        end: '2025-12-17T08:00:00+09:00',
      },
      {
        start: '2025-12-17T19:00:00+09:00', // After work hours
        end: '2025-12-17T20:00:00+09:00',
      },
    ];

    const result = calculateFreeTime(busySlots, baseRequest);

    // Should have full work day available
    expect(result).toHaveLength(1);
    expect(result[0].durationMinutes).toBe(540); // 9 hours
  });

  test('should handle busy slots partially overlapping work hours', () => {
    const busySlots: BusySlot[] = [
      {
        start: '2025-12-17T08:00:00+09:00', // Starts before work, ends during
        end: '2025-12-17T10:00:00+09:00',
      },
      {
        start: '2025-12-17T17:00:00+09:00', // Starts during work, ends after
        end: '2025-12-17T19:00:00+09:00',
      },
    ];

    const result = calculateFreeTime(busySlots, baseRequest);

    // Should have 10:00-17:00 free (420 min)
    expect(result).toHaveLength(1);
    expect(result[0].durationMinutes).toBe(420);
  });

  test('should handle multiple days', () => {
    const request: FreeTimeRequest = {
      ...baseRequest,
      startDate: '2025-12-17',
      endDate: '2025-12-18',
    };

    const busySlots: BusySlot[] = [];

    const result = calculateFreeTime(busySlots, request);

    // Should have 2 full days
    expect(result).toHaveLength(2);
    expect(result[0].date).toBe('2025-12-17');
    expect(result[1].date).toBe('2025-12-18');
    expect(result[0].durationMinutes).toBe(540);
    expect(result[1].durationMinutes).toBe(540);
  });

  test('should return empty array when fully busy', () => {
    const busySlots: BusySlot[] = [
      {
        start: '2025-12-17T09:00:00+09:00',
        end: '2025-12-17T18:00:00+09:00',
      },
    ];

    const result = calculateFreeTime(busySlots, baseRequest);

    expect(result).toHaveLength(0);
  });

  test('should handle back-to-back busy slots', () => {
    const busySlots: BusySlot[] = [
      {
        start: '2025-12-17T10:00:00+09:00',
        end: '2025-12-17T11:00:00+09:00',
      },
      {
        start: '2025-12-17T11:00:00+09:00', // Starts exactly when previous ends
        end: '2025-12-17T12:00:00+09:00',
      },
    ];

    const result = calculateFreeTime(busySlots, baseRequest);

    expect(result).toHaveLength(2);
    // Morning: 09:00-10:00 (60 min)
    expect(result[0].durationMinutes).toBe(60);
    // Afternoon: 12:00-18:00 (360 min)
    expect(result[1].durationMinutes).toBe(360);
  });

  test('should throw error for invalid date range', () => {
    const request: FreeTimeRequest = {
      ...baseRequest,
      startDate: '2025-12-20',
      endDate: '2025-12-17', // End before start
    };

    expect(() => calculateFreeTime([], request)).toThrow();
  });
});

describe('groupFreeSlotsByDate', () => {
  test('should group slots by date', () => {
    const freeSlots = [
      {
        start: '2025-12-17T09:00:00+09:00',
        end: '2025-12-17T10:00:00+09:00',
        durationMinutes: 60,
        date: '2025-12-17',
      },
      {
        start: '2025-12-17T14:00:00+09:00',
        end: '2025-12-17T15:00:00+09:00',
        durationMinutes: 60,
        date: '2025-12-17',
      },
      {
        start: '2025-12-18T09:00:00+09:00',
        end: '2025-12-18T10:00:00+09:00',
        durationMinutes: 60,
        date: '2025-12-18',
      },
    ];

    const grouped = groupFreeSlotsByDate(freeSlots);

    expect(Object.keys(grouped)).toHaveLength(2);
    expect(grouped['2025-12-17']).toHaveLength(2);
    expect(grouped['2025-12-18']).toHaveLength(1);
  });

  test('should handle empty array', () => {
    const grouped = groupFreeSlotsByDate([]);

    expect(Object.keys(grouped)).toHaveLength(0);
  });
});
