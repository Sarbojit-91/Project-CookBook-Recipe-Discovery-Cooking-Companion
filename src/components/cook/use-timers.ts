"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type CookingTimer = {
  id: string;
  label: string;
  durationMs: number;
  /** When running: the moment it ends. */
  endsAt: number | null;
  /** When paused: time left. */
  remainingMs: number;
  done: boolean;
};

function beep(ctx: AudioContext) {
  const now = ctx.currentTime;
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, now + i * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.3, now + i * 0.35 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.35 + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.35);
    osc.stop(now + i * 0.35 + 0.3);
  }
}

/** Several independent countdown timers that survive re-renders and alert when they finish. */
export function useTimers() {
  const [timers, setTimers] = useState<CookingTimer[]>([]);
  // Only read once a timer exists; every action that starts or resumes a timer sets it first.
  const [now, setNow] = useState(0);
  const audio = useRef<AudioContext | null>(null);

  const timersRef = useRef(timers);
  useEffect(() => {
    timersRef.current = timers;
  }, [timers]);

  const running = timers.some((t) => t.endsAt !== null && !t.done);

  // Tick while any timer runs; finished timers are marked and announced from the tick itself.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const t = Date.now();
      setNow(t);
      const finished = timersRef.current.filter(
        (x) => x.endsAt !== null && !x.done && x.endsAt <= t,
      );
      if (finished.length === 0) return;
      const ids = new Set(finished.map((f) => f.id));
      setTimers((all) =>
        all.map((x) => (ids.has(x.id) ? { ...x, done: true, endsAt: null, remainingMs: 0 } : x)),
      );
      if (audio.current) beep(audio.current);
      navigator.vibrate?.([300, 150, 300]);
      if ("Notification" in window && Notification.permission === "granted" && document.hidden) {
        for (const f of finished) new Notification("Timer done", { body: f.label });
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  /** Must be called from a click so browsers allow sound later. */
  const unlockAudio = useCallback(() => {
    audio.current ??= new AudioContext();
    if (audio.current.state === "suspended") void audio.current.resume();
  }, []);

  const start = useCallback(
    (label: string, seconds: number) => {
      unlockAudio();
      const durationMs = seconds * 1000;
      const t = Date.now();
      setNow(t);
      setTimers((all) => [
        ...all,
        {
          id: crypto.randomUUID(),
          label,
          durationMs,
          endsAt: t + durationMs,
          remainingMs: durationMs,
          done: false,
        },
      ]);
    },
    [unlockAudio],
  );

  const toggle = useCallback((id: string) => {
    const t = Date.now();
    setNow(t);
    setTimers((all) =>
      all.map((timer) => {
        if (timer.id !== id || timer.done) return timer;
        return timer.endsAt !== null
          ? { ...timer, endsAt: null, remainingMs: Math.max(0, timer.endsAt - t) }
          : { ...timer, endsAt: t + timer.remainingMs };
      }),
    );
  }, []);

  const addMinute = useCallback((id: string) => {
    setTimers((all) =>
      all.map((timer) => {
        if (timer.id !== id) return timer;
        if (timer.done)
          return { ...timer, done: false, endsAt: Date.now() + 60_000, remainingMs: 60_000 };
        return timer.endsAt !== null
          ? { ...timer, endsAt: timer.endsAt + 60_000 }
          : { ...timer, remainingMs: timer.remainingMs + 60_000 };
      }),
    );
  }, []);

  const remove = useCallback(
    (id: string) => setTimers((all) => all.filter((t) => t.id !== id)),
    [],
  );

  const remaining = (timer: CookingTimer) =>
    timer.done ? 0 : timer.endsAt !== null ? Math.max(0, timer.endsAt - now) : timer.remainingMs;

  return { timers, start, toggle, addMinute, remove, remaining, unlockAudio };
}

export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(h ? 2 : 1, "0");
  return `${h ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}
