import { BookButton } from '@/components/book-button';
import { Band, BandHead } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { weekOrder } from '@/content/hours';
import { addressLines, site } from '@/content/site';
import { formatRange, istDay } from '@/lib/hours';

export function FindUs() {
  // the lounge's day, not the server's — a UTC render rolls over 5.5 hours early
  const today = istDay();

  return (
    <Band id="find">
      {/* "3 minutes on foot" is kept by hand; it tracks site.transit in content/site.ts. */}
      <BandHead eyebrow="06 / Find us" title="Up one flight, above the bakery">
        Lane 6, 3 minutes on foot from Ramwadi metro. Parking gets tight after 8 pm, so in the
        evening an auto is easier than driving.
      </BandHead>

      <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <h3 className="eyebrow">The address</h3>
          <address className="mt-3 text-[1.05rem] not-italic leading-relaxed">
            {addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          <p className="mt-2 text-[0.9rem] text-dim">{site.landmark}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <BookButton>Book a bay</BookButton>
            <ButtonLink href={site.mapsUrl} variant="ghost" external>
              Directions
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 3h7v7M13 3 3.5 12.5" />
              </svg>
            </ButtonLink>
            <ButtonLink href={`tel:${site.phone}`} variant="quiet" className="font-mono">
              {site.phoneDisplay}
            </ButtonLink>
          </div>

          {/*
            A styled panel instead of a Maps iframe: a third-party frame here
            would load a megabyte of script and a cookie, and cost more in
            performance than a static map ever returns.
          */}
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            // the accessible name has to contain the visible text, or voice
            // control cannot act on what a sighted user reads
            aria-label={`Map loads on tap — open ${site.name} in Google Maps`}
            className="lit-hover relative mt-8 flex h-[220px] items-center justify-center overflow-hidden rounded-card border border-edge bg-room-deep bg-[repeating-linear-gradient(0deg,transparent_0_31px,var(--color-edge)_31px_32px),repeating-linear-gradient(90deg,transparent_0_31px,var(--color-edge)_31px_32px)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-[2px]"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,var(--glow-accent-soft),transparent_62%)]"
            />
            <span className="relative flex flex-col items-center gap-3 px-6 text-center">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="text-accent"
              >
                <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-dim">
                Map loads on tap
              </span>
            </span>
          </a>
        </div>

        <div>
          <h3 className="eyebrow">Opening hours</h3>
          <ul className="mt-3 divide-y divide-edge border-y border-edge">
            {weekOrder.map((entry) => {
              const isToday = entry.day === today;
              return (
                <li
                  key={entry.day}
                  aria-current={isToday ? 'date' : undefined}
                  className={`flex items-baseline justify-between gap-4 px-3 py-3 ${
                    isToday ? 'bg-surface' : ''
                  }`}
                >
                  <span className={`text-[0.95rem] ${isToday ? 'font-medium' : 'text-dim'}`}>
                    {entry.label}
                  </span>
                  <span className="flex items-baseline gap-3">
                    {isToday ? (
                      <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-accent">
                        Today
                      </span>
                    ) : null}
                    <span className={`font-mono text-[0.88rem] ${isToday ? 'text-paper' : 'text-dim'}`}>
                      {formatRange(entry)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          {/* These three clock readings are kept by hand; they track content/hours.ts. */}
          <p className="mt-4 max-w-[38ch] text-[0.85rem] text-dim">
            Weekdays open at <span className="font-mono">1 pm</span>, weekends at{' '}
            <span className="font-mono">11 am</span>. Friday and Saturday run to midnight.
          </p>
        </div>
      </div>
    </Band>
  );
}
