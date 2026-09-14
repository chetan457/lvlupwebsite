import Image from 'next/image';

import { BookButton } from '@/components/book-button';
import { Band } from '@/components/ui/section';
import { photoSrc, photos } from '@/content/images';
import { buyout, payment } from '@/content/pricing';
import { partyMessage, site } from '@/content/site';

const inr = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

/** Figures a party organiser asks for in this order, before anything else. */
const facts = [
  {
    term: 'Whole-lounge rate',
    figure: `${inr(buyout.rate)}`,
    unit: '/hr',
    note: `${inr(buyout.weekendRate)}/hr on Saturday and Sunday`,
  },
  { term: 'Minimum booking', figure: String(buyout.minimumHours), unit: ' hours', note: null },
  {
    term: 'Seats',
    figure: String(buyout.seats),
    unit: '',
    note: `Across ${site.bays} bays, all of them yours`,
  },
  { term: 'Advance to hold the date', figure: inr(buyout.deposit), unit: '', note: 'Back with 24 hours notice' },
];

/**
 * The whole-room pitch.
 *
 * An earlier pass ran the photograph behind the entire panel. It read badly:
 * the scrim was horizontal, so the price column — the most important text in
 * the block — landed on the brightest part of the frame, and a mid-tone
 * photograph behind a dense figure list is noise either way.
 *
 * So the photograph gets its own band across the top, where large type can sit
 * on it safely, and the figures sit on flat surface underneath where they are
 * crisp. Cinematic where cinema helps, plain where legibility matters.
 *
 * Rendered on both the home page and /pricing, where it sits at a different
 * point in the numbered run — so the band number is the caller's to set.
 *
 * /pricing prints the cancellation line again in its own Paying band, so that
 * page turns this copy off rather than saying the same sentence twice.
 */
export function Buyout({
  eyebrow = '04 / The whole room',
  showCancellation = true,
}: { eyebrow?: string; showCancellation?: boolean } = {}) {
  return (
    <Band id="parties">
      <div className="lit overflow-hidden rounded-card border border-edge bg-surface/50">
        {/* --- the frame --- */}
        <div className="relative isolate aspect-[16/10] w-full sm:aspect-[21/8] lg:aspect-[24/7]">
          <Image
            src={photoSrc(photos.couchCoop, 1800, 760)}
            alt=""
            fill
            loading="lazy"
            sizes="(max-width: 78rem) 100vw, 78rem"
            placeholder="blur"
            blurDataURL={photos.couchCoop.blur}
            className="object-cover object-[50%_46%]"
          />
          {/*
            Vertical, not horizontal: the type sits at the foot of the frame, so
            that is the only part that has to be dark. The top stays open and
            the photograph keeps its light.
          */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'linear-gradient(to top, rgb(var(--ch-room) / 0.94) 0%, rgb(var(--ch-room) / 0.6) 34%, rgb(var(--ch-room) / 0.1) 68%, rgb(var(--ch-room) / 0.2) 100%)',
            }}
          />

          <div className="absolute inset-x-0 bottom-0 p-[clamp(1.25rem,3.5vw,2.5rem)]">
            <p className="eyebrow">{eyebrow}</p>
            <h2 className="mt-2 max-w-[18ch] text-[clamp(1.7rem,3.6vw,2.6rem)]">
              Take the lounge for the evening
            </h2>
          </div>
        </div>

        {/* --- the offer, on flat surface where figures stay crisp --- */}
        {/*
          Three blocks in one grid rather than two columns, so the reading order
          differs by device without duplicating anything. On a phone they stack
          pitch -> price -> ask, because nobody commits before seeing the rate.
          At lg the figures move to their own column spanning both rows, which
          puts the ask directly under the pitch and leaves no stranded space.
        */}
        <div className="grid gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-8 p-[clamp(1.5rem,4vw,2.75rem)] lg:grid-cols-[1fr_minmax(0,22rem)] lg:grid-rows-[auto_1fr]">
          <div className="flex flex-col items-start lg:col-start-1 lg:row-start-1">
            <p className="max-w-[48ch] text-[0.98rem] text-dim">
              Nobody else walks in while you are in here. Send a date and a headcount and we will
              hold the slot; the room is yours from the moment the first person arrives.
            </p>

            <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {buyout.includes.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[0.92rem]">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="mt-[5px] shrink-0 text-accent"
                  >
                    <path d="M3 8.5 6.5 12 13 4.5" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 max-w-[48ch] text-[0.92rem] text-dim">
              Split between {buyout.seats} people, the {buyout.minimumHours}-hour minimum comes to{' '}
              {inr((buyout.rate * buyout.minimumHours) / buyout.seats)} each on a weekday and{' '}
              {inr((buyout.weekendRate * buyout.minimumHours) / buyout.seats)} at the weekend.
            </p>
            <p className="mt-3 max-w-[48ch] text-[0.92rem] text-dim">
              Under-12s are fine with an adult in the room. The 18-rated games stay off while
              children are in.
            </p>
          </div>

          {/*
            Its own panel so the figures read as a quote rather than as body
            copy that happens to contain numbers.
          */}
          <div className="rounded-[12px] border border-edge bg-room-deep/60 p-[clamp(1.1rem,2.5vw,1.5rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <h3 className="eyebrow">The numbers</h3>

            <dl className="mt-3 divide-y divide-edge">
              {facts.map((fact) => (
                <div key={fact.term} className="grid grid-cols-[1fr_auto] items-baseline gap-x-5 py-3.5 first:pt-0 last:pb-0">
                  {/* the note rides with the label, so the figures stay one clean column */}
                  <dt className="text-[0.9rem] text-dim">
                    {fact.term}
                    {fact.note ? (
                      <span className="mt-0.5 block text-[0.76rem] leading-snug text-dimmer">
                        {fact.note}
                      </span>
                    ) : null}
                  </dt>
                  <dd className="whitespace-nowrap text-right font-mono text-[1.2rem] tracking-[-0.03em] text-paper tabular-nums">
                    {fact.figure}
                    {fact.unit ? (
                      <span className="text-[0.8rem] text-dim">{fact.unit}</span>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col items-start lg:col-start-1 lg:row-start-2">
            <BookButton message={partyMessage} size="lg">
              Ask about a buyout
            </BookButton>
            {showCancellation ? (
              <p className="mt-6 max-w-[46ch] border-t border-edge pt-4 text-[0.82rem] leading-snug text-dim">
                {payment.cancellation}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </Band>
  );
}
