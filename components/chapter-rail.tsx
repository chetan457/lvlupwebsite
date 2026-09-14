'use client';

import { useEffect, useState } from 'react';

/**
 * A fixed rail down the right edge showing which section you are in.
 *
 * The home page is long — bays, games, rates, parties, reviews, directions —
 * and without a marker the games corridor in particular leaves you with no idea
 * how much is left. The rail is a position indicator first and a shortcut
 * second, which is why the labels are quiet and the dots are the loud part.
 *
 * Desktop only: on a phone it would eat thumb space beside the booking dock for
 * a page that is a quarter as tall.
 */

const CHAPTERS = [
  { id: 'top', label: 'The room' },
  { id: 'bays', label: 'Bays' },
  { id: 'games', label: 'Games' },
  { id: 'rates', label: 'Rates' },
  { id: 'parties', label: 'Parties' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'find', label: 'Find us' },
] as const;

export function ChapterRail() {
  const [active, setActive] = useState<string>('top');
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(max-width: 63.99rem), (pointer: coarse)').matches) return;

    const sections = CHAPTERS.map((c) => document.getElementById(c.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;

    setShown(true);

    /*
      Whichever section covers the middle of the viewport wins. Picking by
      "first one intersecting" flickers between neighbours on a long section,
      and the corridor is three screens tall.
    */
    const observer = new IntersectionObserver(
      () => {
        const mid = window.innerHeight / 2;
        let best: string = CHAPTERS[0].id;
        let bestGap = Infinity;

        for (const section of sections) {
          const { top, bottom } = section.getBoundingClientRect();
          if (top > window.innerHeight || bottom < 0) continue;
          const gap = top <= mid && bottom >= mid ? 0 : Math.min(Math.abs(top - mid), Math.abs(bottom - mid));
          if (gap < bestGap) {
            bestGap = gap;
            best = section.id;
          }
        }
        setActive(best);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  if (!shown) return null;

  return (
    <nav
      aria-label="Sections"
      className="fixed right-[clamp(1rem,2vw,1.75rem)] top-1/2 z-30 hidden -translate-y-1/2 lg:block"
    >
      <ul className="flex flex-col gap-1">
        {CHAPTERS.map((chapter) => {
          const current = active === chapter.id;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                aria-current={current ? 'true' : undefined}
                className="group flex items-center justify-end gap-3 rounded-full py-1.5 pl-3 pr-1"
              >
                <span
                  className={`font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    current
                      ? 'text-paper opacity-100'
                      : 'text-dim opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'
                  }`}
                >
                  {chapter.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`block h-px transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    current ? 'w-6 bg-accent' : 'w-3 bg-edge-hi group-hover:w-5 group-hover:bg-dim'
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
