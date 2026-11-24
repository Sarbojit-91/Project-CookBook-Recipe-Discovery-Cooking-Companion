"use client";

import { useEffect, useState } from "react";

/** Keeps the screen on while cooking, where the browser supports the Screen Wake Lock API. */
export function useWakeLock(enabled: boolean) {
  const [active, setActive] = useState(false);
  const supported = typeof navigator !== "undefined" && "wakeLock" in navigator;

  useEffect(() => {
    if (!enabled || !supported) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;

    const request = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
        if (cancelled) {
          await lock.release();
          return;
        }
        setActive(true);
        lock.addEventListener("release", () => setActive(false));
      } catch {
        setActive(false);
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") void request();
    };

    void request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release();
    };
  }, [enabled, supported]);

  return { supported, active };
}
