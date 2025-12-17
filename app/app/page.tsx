'use client';

/**
 * Main application page
 *
 * Features:
 * - Form to input search parameters
 * - Display free time slots grouped by date
 * - Copy button for each slot
 * - Logout functionality
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FreeSlot, FreeTimeRequest } from '@/types/calendar';
import { DateTime } from 'luxon';

interface Calendar {
  id: string;
  summary: string;
}

export default function AppPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [calendarsLoading, setCalendarsLoading] = useState(true);
  const [email, setEmail] = useState<string>('');
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [freeSlots, setFreeSlots] = useState<FreeSlot[]>([]);
  const [error, setError] = useState<string>('');
  const [copiedSlot, setCopiedSlot] = useState<string | null>(null);

  // Form state
  const [calendarId, setCalendarId] = useState('primary');
  const [startDate, setStartDate] = useState(
    DateTime.now().toISODate() || ''
  );
  const [endDate, setEndDate] = useState(
    DateTime.now().plus({ days: 7 }).toISODate() || ''
  );
  const [workStartTime, setWorkStartTime] = useState('09:00');
  const [workEndTime, setWorkEndTime] = useState('18:00');
  const [minFreeMinutes, setMinFreeMinutes] = useState(30);
  const [timezone, setTimezone] = useState('Asia/Tokyo');

  useEffect(() => {
    // Check authentication
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (!data.isAuthenticated) {
          router.push('/login');
        } else {
          setEmail(data.email || 'unknown');
        }
      })
      .catch(() => {
        router.push('/login');
      });

    // Load calendars
    fetch('/api/calendars')
      .then((res) => res.json())
      .then((data) => {
        if (data.calendars) {
          setCalendars(data.calendars);
        }
        setCalendarsLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load calendars:', err);
        setCalendarsLoading(false);
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFreeSlots([]);

    const request: FreeTimeRequest = {
      calendarId,
      startDate,
      endDate,
      workStartTime,
      workEndTime,
      minFreeMinutes,
      timezone,
    };

    try {
      const res = await fetch('/api/free-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to calculate free time');
      }

      setFreeSlots(data.freeSlots);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleCopy = (slot: FreeSlot) => {
    const start = DateTime.fromISO(slot.start, { zone: timezone });
    const end = DateTime.fromISO(slot.end, { zone: timezone });
    const text = `${start.toFormat('yyyy-MM-dd HH:mm')}-${end.toFormat('HH:mm')}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedSlot(slot.start);
      setTimeout(() => setCopiedSlot(null), 2000);
    });
  };

  const handleCopyAll = () => {
    const allSlotsText = freeSlots.map((slot) => {
      const start = DateTime.fromISO(slot.start, { zone: timezone });
      const end = DateTime.fromISO(slot.end, { zone: timezone });
      return `${start.toFormat('yyyy-MM-dd HH:mm')}-${end.toFormat('HH:mm')} (${slot.durationMinutes}分)`;
    }).join('\n');

    navigator.clipboard.writeText(allSlotsText).then(() => {
      setCopiedSlot('all');
      setTimeout(() => setCopiedSlot(null), 2000);
    });
  };

  // Group free slots by date
  const groupedSlots = freeSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {} as Record<string, FreeSlot[]>);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Google Calendar 空き時間検索</h1>
              <p className="text-gray-600 text-sm mt-1">ログイン中: {email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 border border-red-600 rounded-md hover:bg-red-50 transition"
            >
              ログアウト
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">検索条件</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Calendar Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カレンダー
              </label>
              <select
                value={calendarId}
                onChange={(e) => setCalendarId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={calendarsLoading}
              >
                {calendarsLoading ? (
                  <option>読み込み中...</option>
                ) : (
                  calendars.map((cal) => (
                    <option key={cal.id} value={cal.id}>
                      {cal.summary}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  開始日
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  終了日
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Work Hours */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  勤務開始時刻
                </label>
                <input
                  type="time"
                  value={workStartTime}
                  onChange={(e) => setWorkStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  勤務終了時刻
                </label>
                <input
                  type="time"
                  value={workEndTime}
                  onChange={(e) => setWorkEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Min Free Minutes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                最小空き時間（分）
              </label>
              <input
                type="number"
                value={minFreeMinutes}
                onChange={(e) => setMinFreeMinutes(parseInt(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Timezone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                タイムゾーン
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Asia/Tokyo">Asia/Tokyo (日本)</option>
                <option value="America/New_York">America/New_York (米国東部)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (米国西部)</option>
                <option value="Europe/London">Europe/London (英国)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-md transition duration-200"
            >
              {loading ? '検索中...' : '空き時間を検索'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results */}
        {freeSlots.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">
                空き時間（{freeSlots.length}件）
              </h2>
              <button
                onClick={handleCopyAll}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copiedSlot === 'all' ? '✓ コピー済み' : '全てコピー'}
              </button>
            </div>
            <div className="space-y-6">
              {Object.entries(groupedSlots).map(([date, slots]) => (
                <div key={date}>
                  <h3 className="text-lg font-medium text-gray-800 mb-2 border-b pb-1">
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {slots.map((slot, index) => {
                      const start = DateTime.fromISO(slot.start, { zone: timezone });
                      const end = DateTime.fromISO(slot.end, { zone: timezone });

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition"
                        >
                          <div>
                            <span className="font-medium">
                              {start.toFormat('HH:mm')} - {end.toFormat('HH:mm')}
                            </span>
                            <span className="text-gray-600 ml-2">
                              ({slot.durationMinutes}分)
                            </span>
                          </div>
                          <button
                            onClick={() => handleCopy(slot)}
                            className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                          >
                            {copiedSlot === slot.start ? 'コピー済み' : 'コピー'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && freeSlots.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-600">
            検索条件を入力して「空き時間を検索」ボタンをクリックしてください
          </div>
        )}
      </div>
    </div>
  );
}
