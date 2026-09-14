import type { ReactNode } from 'react';

/**
 * Every content band on the site shares one rhythm: a numbered eyebrow, a
 * heading capped at roughly 18 characters a line, and an optional standfirst
 * sitting to the right on wide screens.
 */

export function Band({
  id,
  children,
  className = '',
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative border-b border-edge bg-room py-[clamp(3.25rem,7vw,5.5rem)] ${className}`}
    >
      <div className="shell">{children}</div>
    </section>
  );
}

export function BandHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-[clamp(1.75rem,4vw,2.75rem)] flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
      <div className="flex flex-col gap-3">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="max-w-[18ch] text-[clamp(1.6rem,3.2vw,2.25rem)]">{title}</h2>
      </div>
      {children ? (
        <p className="max-w-[46ch] text-[0.95rem] text-dim">{children}</p>
      ) : null}
    </div>
  );
}

/**
 * Wide content — tables, racks — scrolls inside its own box, never the page.
 * The box is a tab stop so a keyboard can scroll it, which means it needs a
 * name: without `label` it stays a plain focusable div rather than a nameless
 * `region`, which assistive tech ignores anyway.
 */
export function Scroller({
  children,
  className = '',
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={`overflow-x-auto ${className}`}
      tabIndex={0}
      {...(label ? { role: 'region', 'aria-label': label } : {})}
    >
      {children}
    </div>
  );
}
