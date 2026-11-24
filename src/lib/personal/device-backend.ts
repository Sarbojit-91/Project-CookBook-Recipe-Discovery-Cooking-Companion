import { EMPTY_DATA, type PersonalData } from "./types";

const KEY = "cookbook:v1:device";

/** Fills in anything missing from older or damaged saved data instead of crashing. */
export function hydrate(raw: unknown): PersonalData {
  if (!raw || typeof raw !== "object") return EMPTY_DATA;
  const r = raw as Partial<PersonalData>;
  const arr = <T>(v: T[] | undefined) => (Array.isArray(v) ? v : []);
  return {
    favourites: arr(r.favourites),
    folders: arr(r.folders),
    collections: arr(r.collections),
    notes: r.notes && typeof r.notes === "object" ? r.notes : {},
    plan: arr(r.plan),
    shopping: arr(r.shopping),
    profile: { ...EMPTY_DATA.profile, ...(r.profile ?? {}) },
  };
}

export function loadDevice(): PersonalData {
  try {
    const text = window.localStorage.getItem(KEY);
    return text ? hydrate(JSON.parse(text)) : EMPTY_DATA;
  } catch {
    return EMPTY_DATA;
  }
}

/** Returns false when storage is full or blocked (e.g. some private browsing modes). */
export function saveDevice(data: PersonalData): boolean {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function onDeviceChange(callback: () => void): () => void {
  const handler = (event: StorageEvent) => {
    if (event.key === KEY) callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}
