"use client";

import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { loadAccount, syncAction } from "@/lib/personal/account-backend";
import { loadDevice, onDeviceChange, saveDevice } from "@/lib/personal/device-backend";
import { reducer } from "@/lib/personal/reducer";
import { EMPTY_DATA, type Action, type PersonalData } from "@/lib/personal/types";
import { getSupabase } from "@/lib/supabase/client";
import { useToast } from "./toast-provider";

export type PersonalMode = "device" | "account";

type PersonalContextValue = {
  /** "loading" until saved data has been read; screens show skeletons until then. */
  status: "loading" | "ready";
  mode: PersonalMode;
  user: { id: string; email: string } | null;
  data: PersonalData;
  dispatch: (action: Action) => void;
  signOut: () => Promise<void>;
};

const PersonalContext = createContext<PersonalContextValue | null>(null);

export function PersonalProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [session, setSession] = useState<Session | null>(null);
  const [data, setData] = useState<PersonalData>(EMPTY_DATA);
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);
  const mode: PersonalMode = session ? "account" : "device";

  // Follow the Supabase session when accounts are configured.
  useEffect(() => {
    const db = getSupabase();
    if (!db) {
      // Read local storage after hydration so the first render matches the static HTML.
      void Promise.resolve().then(() => {
        setData(loadDevice());
        setStatus("ready");
      });
      return onDeviceChange(() => setData(loadDevice()));
    }
    let cancelled = false;
    let stopDeviceSync: (() => void) | undefined;
    let loadedFor: string | null | undefined;

    const apply = async (next: Session | null) => {
      // Supabase repeats SIGNED_IN when a tab regains focus; only reload when the user changes.
      if (cancelled || (next?.user.id ?? null) === loadedFor) return;
      loadedFor = next?.user.id ?? null;
      setSession(next);
      stopDeviceSync?.();
      stopDeviceSync = undefined;
      if (!next) {
        setData(loadDevice());
        stopDeviceSync = onDeviceChange(() => setData(loadDevice()));
        setStatus("ready");
        return;
      }
      setStatus("loading");
      try {
        const loaded = await loadAccount(db);
        if (!cancelled) setData(loaded);
      } catch {
        if (!cancelled) {
          setData(EMPTY_DATA);
          toast({
            message: "We couldn't load your saved recipes. Check your connection and refresh.",
          });
        }
      } finally {
        if (!cancelled) setStatus("ready");
      }
    };

    db.auth.getSession().then(({ data: { session: s } }) => apply(s));
    const { data: sub } = db.auth.onAuthStateChange((event, s) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        apply(s);
      }
    });
    return () => {
      cancelled = true;
      stopDeviceSync?.();
      sub.subscription.unsubscribe();
    };
  }, [toast]);

  const dispatch = useCallback(
    (action: Action) => {
      const previous = dataRef.current;
      const next = reducer(previous, action);
      if (next === previous) return;
      dataRef.current = next;
      setData(next);

      const db = getSupabase();
      if (session && db) {
        syncAction(db, session.user.id, action, next).catch(async () => {
          toast({ message: "That change couldn't be saved. Check your connection and try again." });
          try {
            setData(await loadAccount(db));
          } catch {
            setData(previous);
          }
        });
      } else if (!saveDevice(next)) {
        toast({
          message: "Your browser's storage is full or blocked, so this change won't be kept.",
        });
      }
    },
    [session, toast],
  );

  const signOut = useCallback(async () => {
    await getSupabase()?.auth.signOut();
  }, []);

  const value = useMemo<PersonalContextValue>(
    () => ({
      status,
      mode,
      user: session ? { id: session.user.id, email: session.user.email ?? "" } : null,
      data,
      dispatch,
      signOut,
    }),
    [status, mode, session, data, dispatch, signOut],
  );

  return <PersonalContext value={value}>{children}</PersonalContext>;
}

export function usePersonal(): PersonalContextValue {
  const value = useContext(PersonalContext);
  if (!value) throw new Error("usePersonal must be used inside <PersonalProvider>");
  return value;
}

/** Random id for new personal records, shared by device and account storage. */
export function newId(): string {
  return crypto.randomUUID();
}

export function nowISO(): string {
  return new Date().toISOString();
}
