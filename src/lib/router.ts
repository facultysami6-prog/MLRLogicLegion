import { useCallback, useEffect, useState } from "react";

/**
 * Tiny hash router — keeps the site a true SPA with zero backend,
 * shareable URLs and browser back/forward support.
 */

export interface Route {
  path: string;
  segments: string[];
  query: Record<string, string>;
}

function parse(hash: string): Route {
  const clean = hash.replace(/^#/, "") || "/";
  const [pathPart, queryPart] = clean.split("?");
  const path = pathPart.startsWith("/") ? pathPart : `/${pathPart}`;
  const query: Record<string, string> = {};
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((v, k) => {
      query[k] = v;
    });
  }
  return { path, segments: path.split("/").filter(Boolean), query };
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(to: string) {
  const target = to.startsWith("#") ? to : `#${to.startsWith("/") ? to : `/${to}`}`;
  if (window.location.hash === target) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  window.location.hash = target;
}

/** Scrolls the window to the top whenever the route changes. */
export function useScrollToTop(routePath: string) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }, [routePath]);
}

/** Anchor <a> that keeps hash navigation (no full page reload). */
export function useNavigate() {
  return useCallback((to: string) => navigate(to), []);
}
