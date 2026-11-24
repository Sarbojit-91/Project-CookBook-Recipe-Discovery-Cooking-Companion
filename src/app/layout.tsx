import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { MobileTabBar } from "@/components/layout/mobile-tab-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
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
  title: {
    default: "CookBook – Recipe Discovery & Cooking Companion",
    template: "%s · CookBook",
  },
  description:
    "Discover recipes, cook step by step, plan your week and build your own recipe collection.",
};

export const viewport: Viewport = {
  themeColor: "#fbf7f2",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col pb-[calc(var(--spacing-tabbar)+env(safe-area-inset-bottom))] md:pb-0">
        <SkipLink />
        <SiteHeader />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          {children}
        </main>
        <SiteFooter />
        <MobileTabBar />
      </body>
    </html>
  );
}
