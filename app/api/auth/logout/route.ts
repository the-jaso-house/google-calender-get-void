/**
 * Logout endpoint - Clears session cookie
 */

import { NextResponse } from 'next/server';
import { clearTokenCookie } from '@/lib/session';

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', clearTokenCookie());

  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  response.headers.set('Set-Cookie', clearTokenCookie());

  return response;
}
