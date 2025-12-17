/**
 * Root page - Redirects to login or app based on authentication status
 */

import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to login page
  // The login page will check authentication and redirect to /app if already logged in
  redirect('/login');
}
