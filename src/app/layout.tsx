import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/lib/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ReduxProvider } from "@/lib/redux/provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "User Management System",
  description: "A web application for managing users",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
  types: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ReduxProvider>
            {children}
            <Toaster />
          </ReduxProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
