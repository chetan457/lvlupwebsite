'use client';

import { useEffect, useState } from 'react';

export const THEMES = [
  { id: 'embers', label: 'Embers', hint: 'Charcoal and warm light' },
  { id: 'midnight', label: 'Midnight', hint: 'Graphite and PlayStation blue' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const THEME_KEY = 'lvlup-theme';

/**
 * Runs before first paint, inlined in <head>, so a returning visitor never sees
 * the default palette flash before their own. Kept as a string because it has
 * to execute ahead of React, and deliberately tiny for the same reason.
 */
export const themeBootScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='midnight'||t==='embers'){document.documentElement.dataset.theme=t}}catch(e){}`;

function apply(theme: ThemeId) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // private mode, or storage disabled — the choice just will not persist
  }
}

export function ThemeToggle() {
  // matches the server render; the boot script may already have set another
  const [theme, setTheme] = useState<ThemeId>('embers');

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === 'midnight' || current === 'embers') setTheme(current);
  }, []);

  return (
    <div
      role="group"
      aria-label="Colour theme"
      className="flex items-center gap-0.5 rounded-full border border-edge bg-surface/60 p-0.5"
    >
      {THEMES.map((option) => {
        const active = theme === option.id;
        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={active}
            title={option.hint}
            onClick={() => {
              setTheme(option.id);
              apply(option.id);
            }}
            className={`rounded-full px-3 py-1.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] transition-colors duration-200 ${
              active ? 'bg-lamp text-lamp-ink' : 'text-dim hover:text-paper'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
