import { createContext, useState, useContext, useEffect, useMemo, useCallback, useSyncExternalStore } from "react";

const ThemeContext = createContext();

/**
 * useTheme — Access theme state and toggle function.
 * Returns { theme, isDark, toggleTheme }
 *
 * Theme Toggle Usage:
 * - The theme defaults to the user's OS preference (prefers-color-scheme).
 * - Clicking the toggle cycles: light → dark → system.
 * - The user's choice is persisted in localStorage under the key "theme".
 * - To reset to system default, cycle until "system" is selected, or
 *   clear localStorage.removeItem("theme").
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}

// Subscribe to OS color-scheme changes without setState inside useEffect
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const subscribeMediaQuery = (callback) => {
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};
const getOsDark = () => mediaQuery.matches;

/**
 * ThemeProvider — Wraps the app to provide theme context.
 * Reads from localStorage, falls back to OS preference.
 * Sets `data-theme` attribute on <html> for CSS variable switching.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
    return "system";
  });

  // Track OS dark-mode preference as an external store (no cascading setState)
  const osDark = useSyncExternalStore(subscribeMediaQuery, getOsDark);

  // Derive the effective theme — pure computation, no state needed
  const effectiveTheme = useMemo(() => {
    if (theme === "system") return osDark ? "dark" : "light";
    return theme;
  }, [theme, osDark]);

  // Side-effects only: update DOM + persist preference
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", effectiveTheme);
    localStorage.setItem("theme", theme);
  }, [theme, effectiveTheme]);

  /**
   * toggleTheme — Cycles through light → dark → system
   */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  }, []);

  const isDark = effectiveTheme === "dark";

  const value = useMemo(
    () => ({ theme, isDark, toggleTheme }),
    [theme, isDark, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
