import type { Metadata } from "next";
import { ProsePage } from "@/components/ui/prose-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What CookBook stores and why.",
};

export default function PrivacyPage() {
  return (
    <ProsePage
      title="Privacy"
      intro="Short version: we keep only what’s needed for the features you use."
    >
      <h2>Without an account</h2>
      <p>
        Your favourites, collections, notes, meal plan and shopping list are saved in your own
        browser (local storage). They never leave your device. Clearing your browser data, or using
        “Clear my data” on the account page, removes them.
      </p>
      <h2>With an account</h2>
      <p>
        If you create an account, we store your email address and the things you save, so they sync
        between devices. This data is held by our database provider, Supabase, and protected so that
        only you can read or change it. You can delete your account and all of its data at any time
        from the account page.
      </p>
      <h2>What we don’t do</h2>
      <ul>
        <li>No advertising, tracking pixels or analytics.</li>
        <li>No selling or sharing of your data.</li>
        <li>No cookies other than what’s needed to keep you signed in.</li>
      </ul>
      <h2>Cooking mode</h2>
      <p>
        Cooking mode may ask to keep your screen on and, if you choose, to show notifications when a
        timer finishes. Both stay on your device, and you can turn notifications off in your browser
        settings.
      </p>
    </ProsePage>
  );
}
