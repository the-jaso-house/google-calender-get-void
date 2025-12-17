'use client';

/**
 * Login page
 *
 * Displays login button and handles OAuth errors
 */

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.isAuthenticated) {
          router.push('/app');
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        setChecking(false);
      });

    // Check for OAuth errors
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(getErrorMessage(errorParam));
    }
  }, [router, searchParams]);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">
          Google Calendar
        </h1>
        <h2 className="text-xl text-center text-gray-600 mb-8">
          空き時間検索
        </h2>

        <p className="text-gray-700 mb-6 text-center">
          Googleカレンダーの予定を確認し、空いている時間を見つけます。
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Googleでサインイン
        </button>

        <div className="mt-6 text-sm text-gray-600">
          <p className="font-semibold mb-2">必要な権限:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>カレンダーの読み取り (予定の確認)</li>
            <li>メールアドレスの取得 (アカウント識別)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function getErrorMessage(error: string): string {
  const errorMessages: Record<string, string> = {
    access_denied: 'アクセスが拒否されました。再度お試しください。',
    missing_code: '認証コードが見つかりませんでした。',
    authentication_failed: '認証に失敗しました。再度お試しください。',
  };

  return errorMessages[error] || '認証エラーが発生しました。';
}
