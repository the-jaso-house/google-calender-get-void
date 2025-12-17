import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Google Calendar Free Time Finder",
  description: "Find available time slots in your Google Calendar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
