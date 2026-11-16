import { lazy } from "react";

// Shared loaders so a page chunk can be warmed up before it is navigated to
// (the import() promise is cached, so preloading and rendering share one fetch).
export const loadAbout = () => import("./components/About/About");
export const loadAdminPanel = () => import("./components/AdminPanel/AdminPanel");

export const About = lazy(loadAbout);
export const AdminPanel = lazy(loadAdminPanel);

const whenIdle = (callback) => {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 3000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 1500);
  return () => window.clearTimeout(id);
};

export const preloadWhenIdle = (...loaders) =>
  whenIdle(() => loaders.forEach((load) => load().catch(() => {})));
