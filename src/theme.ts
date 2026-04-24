import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'sc.theme.codex';

function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === 'light' || value === 'dark') {
      return value;
    }
  } catch {
    // localStorage might be unavailable (SSR, private browsing) — fall through.
  }
  return null;
}

function getPreferredTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const prefersLight = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches;
  return prefersLight ? 'light' : 'dark';
}

export function resolveInitialTheme(): Theme {
  return readStoredTheme() ?? getPreferredTheme();
}

export function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore — persistence is a nicety, not a requirement
  }
}

/**
 * Initialise the theme before React hydrates. Call once, as early as possible,
 * to avoid a flash of the wrong theme. Safe to call multiple times.
 */
export function initTheme() {
  if (typeof document === 'undefined') return;
  const theme = resolveInitialTheme();
  document.documentElement.setAttribute('data-theme', theme);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === 'undefined') return 'light';
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark' || current === 'light') return current;
    return resolveInitialTheme();
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Keep state in sync if another tab / script flips the attribute.
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const current = document.documentElement.getAttribute('data-theme');
      if (current === 'dark' || current === 'light') {
        setThemeState((prev) => (prev === current ? prev : current));
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return { theme, setTheme, toggleTheme } as const;
}
