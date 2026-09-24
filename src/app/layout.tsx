import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InspectFlow — The AI-Native Inspection & Corrective Action Platform",
  description:
    "InspectFlow is the system of record for inspection programs: schedule the check, capture the finding, assign the fix, verify it closed. AI-native, built for operations teams that can't afford an issue to go quiet.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='9' fill='%2317181D'/%3E%3Cpath d='M9 21 L17 28 L31 11' fill='none' stroke='%23F6F2E9' stroke-width='4' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='31' cy='11' r='3.4' fill='%23F5B400'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
