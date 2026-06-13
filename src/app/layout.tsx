import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoTap - Premium NFC Technology",
  description: "Replace paper with premium NFC technology. Digital business cards, car stickers, and interactive menu tags.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
