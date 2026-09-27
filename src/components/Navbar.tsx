import { useEffect, useState } from "react";
import { useApp } from "@/store/AppStore";
import { useScrolled, useLockBody } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Btn, Modal } from "./ui";
import { useRoute } from "@/lib/router";

export { Logo, FreshFindMark } from "./Logo";

export const NAV_ITEMS = [
  { label: "Home", href: "#/" },
  { label: "Find a Market", href: "#/find" },
  { label: "Market Directory", href: "#/directory" },
  { label: "Produce Guide", href: "#/produce" },
  { label: "About", href: "#/about" },
  { label: "Contact", href: "#/contact" },
];

/* Pages whose first screen is light — the glass bar goes solid there. */
const LIGHT_HEADER_ROUTES = ["/saved"];

function isActive(path: string, href: string) {
  const target = href.replace("#", "");
  if (target === "/") return path === "/";
  if (target === "/directory") return path.startsWith("/directory") || path.startsWith("/market");
  if (target === "/produce") return path.startsWith("/produce");
  return path === target;
}

/* ------------------------------------------------------------------ *
 * Organic wavy edge — one shared curve, used both as the mask that
 * shapes the glass and as the hairline highlight riding the same edge.
 * ------------------------------------------------------------------ */
const WAVE_D =
  "M0 88C60 66 120 66 180 88C240 110 300 110 360 88C420 66 480 66 540 88C600 110 660 110 720 88C780 66 840 66 900 88C960 110 1020 110 1080 88C1140 66 1200 66 1260 88C1320 110 1380 110 1440 88";

const WAVE_MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 120' preserveAspectRatio='none'%3E%3Cpath d='${WAVE_D}L1440 0L0 0Z' fill='%23fff'/%3E%3C/svg%3E")`;

function GlassWave({ solid }: { solid: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -bottom-6">
      {/* dark-brown frosted glass, a touch denser once scrolled */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-500",
          solid ? "bg-forest/92" : "bg-forest/55",
        )}
        style={{
          backdropFilter: "blur(22px) saturate(140%)",
          WebkitBackdropFilter: "blur(22px) saturate(140%)",
          maskImage: WAVE_MASK,
          WebkitMaskImage: WAVE_MASK,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      />
      {/* thin red outline riding the wavy edge */}
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={WAVE_D}
          fill="none"
          stroke="rgba(163,8,36,0.65)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Navbar
 * ------------------------------------------------------------------ */
export function Navbar() {
  const scrolled = useScrolled(60);
  const [open, setOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const { bookmarks, user, openLogin, signOut } = useApp();
  const route = useRoute();
  useLockBody(open);

  useEffect(() => {
    setOpen(false);
  }, [route.path]);

  const solid = scrolled || open || LIGHT_HEADER_ROUTES.includes(route.path);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[100] transition-[padding] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          scrolled ? "py-2" : "py-3.5",
        )}
      >
        {/* frosted glass body with a wavy bottom edge */}
        <GlassWave solid={solid} />

        <div className="relative mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 pb-2 sm:px-8">
          {/* logo */}
          <a
            href="#/"
            aria-label="FreshFind home"
            className="shrink-0 transition-transform duration-500 hover:scale-105"
          >
        <img src="/images/logo.png" alt="FreshFind" className="h-10 w-auto" />
          </a>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => {
                const active = isActive(route.path, item.href);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative block whitespace-nowrap px-2.5 py-2 text-[12.5px] font-semibold transition-colors duration-300 xl:px-3.5 xl:text-[13.5px]",
                        active ? "text-leaf" : "text-white/90 hover:text-leaf",
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full bg-leaf transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                        )}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Auth + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#/saved"
              className="group relative inline-flex items-center gap-2 rounded-full border border-leaf/45 px-3.5 py-2 text-[13px] font-semibold text-white/90 transition-all duration-400 hover:border-leaf hover:text-leaf"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 20s-7-4.35-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5C19 15.65 12 20 12 20Z" />
              </svg>
              <span className="hidden xl:inline">Saved</span>
              {bookmarks.length > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-tomato px-1 text-[10px] font-bold text-white">
                  {bookmarks.length}
                </span>
              )}
            </a>

            {user ? (
              <button
                onClick={signOut}
                title="Sign out"
                className="hidden items-center gap-2 rounded-full border border-leaf/45 px-3.5 py-2 text-[13px] font-semibold text-white/90 transition hover:border-leaf hover:text-leaf sm:inline-flex"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-leaf text-[11px] font-bold text-white">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                {user.name.split(" ")[0]}
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setAuthMode("login");
                    openLogin();
                  }}
                  className="hidden rounded-full border border-leaf/50 px-5 py-2 text-[13px] font-bold text-white transition-all duration-400 hover:border-leaf hover:text-leaf sm:block"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setAuthMode("signup");
                    openLogin();
                  }}
                  className="hidden rounded-full bg-leaf px-5 py-2 text-[13px] font-bold text-white transition-all duration-400 hover:bg-leaf-2 md:block"
                >
                  Sign Up
                </button>
              </>
            )}

            <a
              href="#/find"
              className="hidden rounded-full bg-leaf px-5 py-2.5 text-[12.5px] font-bold uppercase tracking-[0.12em] text-white transition-all duration-400 hover:-translate-y-0.5 hover:bg-leaf-2 2xl:inline-block"
            >
              Find a Market
            </a>

            {/* Hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="ff-mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
                  className="grid h-11 w-11 place-items-center rounded-full border border-leaf/45 text-white transition hover:border-leaf hover:text-leaf lg:hidden"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 h-[2px] w-5 rounded bg-current transition-all duration-400",
                    open ? "top-1.5 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-1.5 h-[2px] w-5 rounded bg-current transition-all duration-300",
                    open && "opacity-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 h-[2px] w-5 rounded bg-current transition-all duration-400",
                    open ? "top-1.5 -rotate-45" : "top-3",
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="ff-mobile-nav"
          className={cn(
            "relative overflow-hidden transition-[max-height,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
            open ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <nav aria-label="Mobile" className="px-5 pb-14 pt-3">
            <ul className="divide-y divide-white/10">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-between py-3.5 font-display text-[21px] font-medium text-white transition-colors",
                      isActive(route.path, item.href) && "text-leaf",
                    )}
                  >
                    {item.label}
                    <span aria-hidden="true" className="text-leaf">→</span>
                  </a>
                </li>
              ))}
              <li>
                <a href="#/saved" onClick={() => setOpen(false)} className="flex items-center justify-between py-3.5 font-display text-[21px] font-medium text-white">
                  My Fresh Finds
                  <span className="text-[13px] font-bold text-leaf">{bookmarks.length}</span>
                </a>
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#/find" className="rounded-full bg-leaf px-6 py-3 text-[12.5px] font-bold uppercase tracking-[0.12em] text-white">
                Find a Market
              </a>
              {user ? (
                <Btn variant="outline" size="md" onClick={signOut}>
                  Sign out
                </Btn>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setAuthMode("login");
                      openLogin();
                    }}
                    className="rounded-full border border-leaf/45 px-6 py-3 text-[12.5px] font-bold uppercase tracking-[0.12em] text-white"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode("signup");
                      openLogin();
                    }}
                    className="rounded-full bg-leaf px-6 py-3 text-[12.5px] font-bold uppercase tracking-[0.12em] text-white"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <LoginModal initialMode={authMode} />
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Dummy login / sign up (frontend only — no backend)
 * ------------------------------------------------------------------ */
export function LoginModal({ initialMode = "login" }: { initialMode?: "login" | "signup" }) {
  const { loginOpen, closeLogin, signIn } = useApp();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (loginOpen) setMode(initialMode);
  }, [loginOpen, initialMode]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return setError("Please enter a valid email address.");
    if (pass.length < 4) return setError("Password must be at least 4 characters.");
    setError("");
    signIn(name || email.split("@")[0], email);
    setName("");
    setEmail("");
    setPass("");
  };

  return (
    <Modal open={loginOpen} onClose={closeLogin} title={mode === "login" ? "Welcome back" : "Join FreshFind"}>
      <p className="text-[13.5px] text-muted">
        Demo only — nothing is sent anywhere. Your session is stored locally in your browser.
      </p>

      <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-forest/6 p-1">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-full py-2 text-[12px] font-bold uppercase tracking-[0.12em] transition-all duration-300",
              mode === m ? "bg-forest text-cream" : "text-forest/70 hover:text-forest",
            )}
          >
            {m === "login" ? "Login" : "Sign Up"}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3">
        {mode === "signup" && (
          <label className="block">
            <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.14em] text-forest/70">
              Name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-[14px] outline-none transition focus:border-leaf"
            />
          </label>
        )}
        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.14em] text-forest/70">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-[14px] outline-none transition focus:border-leaf"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11.5px] font-bold uppercase tracking-[0.14em] text-forest/70">
            Password
          </span>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-2xl border border-forest/12 bg-white px-4 py-3 text-[14px] outline-none transition focus:border-leaf"
          />
        </label>

        {error && <p className="text-[13px] font-semibold text-tomato">{error}</p>}

        <Btn type="submit" variant="leaf" className="w-full" withArrow>
          {mode === "login" ? "Login" : "Create account"}
        </Btn>
      </form>
    </Modal>
  );
}
