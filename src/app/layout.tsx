import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gotap.eg"),
  title: {
    default: "GoTap | Premium NFC Technology Solutions",
    template: "%s | GoTap",
  },
  description: "Premium NFC smart products — Digital business cards, smart profiles, and NFC solutions for modern networking.",
  icons: {
    icon: "/icon",
    apple: "/apple-icon",
  },
  openGraph: {
    title: "GoTap | Premium NFC Technology Solutions",
    description: "Smart NFC products for modern networking — Digital business cards, auto-tap profiles, and smart solutions.",
    url: "https://gotap.eg",
    siteName: "GoTap",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GoTap — Premium NFC Technology Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GoTap | Premium NFC Technology Solutions",
    description: "Smart NFC products for modern networking",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
