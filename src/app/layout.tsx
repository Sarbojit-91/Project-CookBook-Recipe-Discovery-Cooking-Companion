import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SkipLink } from "@/components/layout/skip-link";
import { PersonalProvider } from "@/components/providers/personal-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CookBook – Recipe Discovery & Cooking Companion",
    template: "%s · CookBook",
  },
  description:
    "Discover recipes, cook step by step, plan your week and build your own recipe collection.",
  openGraph: { siteName: "CookBook", type: "website", locale: "en_GB" },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f2",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SkipLink />
        <ToastProvider>
          <PersonalProvider>{children}</PersonalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
