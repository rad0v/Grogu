import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

import { SITE } from "@/lib/constants";
import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Playtesting for indie games`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.fullName,
  keywords: [
    "playtesting",
    "game testing",
    "indie games",
    "QA",
    "player feedback",
    "game development",
  ],
  authors: [{ name: "Project Grogu" }],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — Playtesting for indie games`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} — Playtesting for indie games`,
    description: SITE.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0d19",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
