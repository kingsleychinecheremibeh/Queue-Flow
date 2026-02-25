// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { QueueProvider } from "@/context/QueueContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QueueFlow",
  description: "Real-time queue management at your fingertips",
  manifest: "/manifest.json", // This links your PWA settings
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QueueFlow",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#2563eb",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-[#0a0a0a] dark">
      <head>
        {/* This makes the app feel like a real app on mobile status bars */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-zinc-400`}
      >
        <AuthProvider>
          <QueueProvider>
            {children}  
          </QueueProvider>  
        </AuthProvider>
      </body>
    </html>
  );
}