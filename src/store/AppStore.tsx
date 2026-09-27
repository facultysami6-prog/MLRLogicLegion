import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loadAppData } from "@/lib/data";
import { bumpVisitorCount } from "@/lib/utils";
import { CITY_CENTER, distanceKm, requestLocation, type Coords } from "@/lib/utils";
import type { AppData, Bookmark } from "@/lib/types";

const BOOKMARK_KEY = "freshfind.bookmarks.v1";
const USER_KEY = "freshfind.user.v1";

export interface Toast {
  id: number;
  message: string;
  tone: "success" | "neutral" | "warn";
}

interface AppStore {
  data: AppData | null;
  loading: boolean;

  bookmarks: Bookmark[];
  isSaved: (key: string) => boolean;
  toggle: (b: Omit<Bookmark, "note" | "addedAt">) => boolean;
  remove: (key: string) => void;
  setNote: (key: string, note: string) => void;
  clearAll: () => void;

  toasts: Toast[];
  toast: (message: string, tone?: Toast["tone"]) => void;

  user: { name: string; email: string } | null;
  loginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  signIn: (name: string, email: string) => void;
  signOut: () => void;

  location: Coords | null;
  locationLabel: string;
  locate: () => Promise<Coords | null>;
  clearLocation: () => void;
  distanceTo: (c: Coords) => number | null;

  visitors: number;
}

const Ctx = createContext<AppStore | null>(null);

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => safeParse<Bookmark[]>(localStorage.getItem(BOOKMARK_KEY), []));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [user, setUser] = useState<AppStore["user"]>(() => safeParse(localStorage.getItem(USER_KEY), null));
  const [loginOpen, setLoginOpen] = useState(false);
  const [location, setLocation] = useState<Coords | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const toastId = useRef(0);

  /* ---- load JSON content once ---- */
  useEffect(() => {
    let alive = true;
    loadAppData().then((d) => {
      if (!alive) return;
      setData(d);
      setLoading(false);
      bumpVisitorCount();
    });
    return () => {
      alive = false;
    };
  }, []);

  /* ---- persist bookmarks ---- */
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    } catch {
      /* storage unavailable — bookmarks stay in memory for the session */
    }
  }, [bookmarks]);

  const toast = useCallback((message: string, tone: Toast["tone"] = "success") => {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, message, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const isSaved = useCallback((key: string) => bookmarks.some((b) => b.key === key), [bookmarks]);

  const toggle = useCallback(
    (b: Omit<Bookmark, "note" | "addedAt">) => {
      let added = false;
      setBookmarks((prev) => {
        if (prev.some((x) => x.key === b.key)) {
          added = false;
          return prev.filter((x) => x.key !== b.key);
        }
        added = true;
        return [{ ...b, note: "", addedAt: Date.now() }, ...prev];
      });
      toast(
        added ? `${b.name} saved to My Fresh Finds` : `${b.name} removed`,
        added ? "success" : "neutral",
      );
      return added;
    },
    [toast],
  );

  const remove = useCallback((key: string) => {
    setBookmarks((prev) => prev.filter((b) => b.key !== key));
  }, []);

  const setNote = useCallback((key: string, note: string) => {
    setBookmarks((prev) => prev.map((b) => (b.key === key ? { ...b, note } : b)));
  }, []);

  const clearAll = useCallback(() => setBookmarks([]), []);

  const signIn = useCallback(
    (name: string, email: string) => {
      const u = { name, email };
      setUser(u);
      try {
        localStorage.setItem(USER_KEY, JSON.stringify(u));
      } catch {
        /* ignore */
      }
      setLoginOpen(false);
      toast(`Welcome, ${name.split(" ")[0]} 👋`);
    },
    [toast],
  );

  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(USER_KEY);
    } catch {
      /* ignore */
    }
    toast("Signed out");
  }, [toast]);

  const locate = useCallback(async () => {
    const coords = await requestLocation();
    if (coords) {
      setLocation(coords);
      setLocationLabel("Your location");
      toast("Location found — sorting by distance", "success");
    } else {
      setLocation(CITY_CENTER);
      setLocationLabel("Portland centre (approx.)");
      toast("Location unavailable — using city centre", "warn");
    }
    return coords;
  }, [toast]);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setLocationLabel("");
  }, []);

  const distanceTo = useCallback(
    (c: Coords) => (location ? distanceKm(location, c) : null),
    [location],
  );

  const visitors = useMemo(() => bumpVisitorCount(), []);

  const value: AppStore = {
    data,
    loading,
    bookmarks,
    isSaved,
    toggle,
    remove,
    setNote,
    clearAll,
    toasts,
    toast,
    user,
    loginOpen,
    openLogin: () => setLoginOpen(true),
    closeLogin: () => setLoginOpen(false),
    signIn,
    signOut,
    location,
    locationLabel,
    locate,
    clearLocation,
    distanceTo,
    visitors,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
