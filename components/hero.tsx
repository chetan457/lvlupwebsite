import { BookButton } from '@/components/book-button';
import { HeroRoom } from '@/components/hero-room';
import { LiveBadge } from '@/components/live-badge';
import { ButtonLink } from '@/components/ui/button';
import { cheapestHour, cheapestHourWhen, standardHour } from '@/content/pricing';
import { site } from '@/content/site';
import { liveStations } from '@/content/stations';
import { openState } from '@/lib/hours';

/**
 * The hero, rebuilt.
 *
 * What was here before was a full-bleed stock photograph of a purple-neon
 * gaming room with the headline sitting on top of it. Three faults: the purple
 * fought a graphite-and-blue palette, the photograph was not this venue, and
 * the scrims needed to keep the headline legible had washed it out. There is a
 * ceiling on how good that arrangement can look.
 *
 * Measuring three premium sites showed what they all share and this had none
 * of: a flat near-black ground, ONE focal object, big tight-tracked type, and a
 * lot of emptiness. Not one of them puts a busy image behind its headline.
 *
 * So the ground under the type is flat, and the object is the room itself,
 * built in CSS from the real bay count — see components/hero-room.tsx.
 *
 * The rate is deliberately the second-largest type on the page. For a
 * by-the-hour venue that is the fact people came for, and the old hero buried
 * it mid-paragraph.
 */
export function Hero() {
  const state = openState();
  const seats = liveStations.reduce((total, station) => total + station.seats, 0);

  return (
    <section id="top" className="relative isolate overflow-hidden border-b border-edge bg-room">
      <HeroRoom open={state.open} />

      <div className="shell relative z-10">
        <div className="flex min-h-[clamp(30rem,80vh,46rem)] max-w-[34rem] flex-col justify-center gap-7 py-[clamp(3.5rem,9vw,6rem)] lg:max-w-[38rem]">
          <LiveBadge initial={state} />

          <h1 className="text-[clamp(2.6rem,6.4vw,5rem)] font-medium leading-[0.96] tracking-[-0.042em]">
            PlayStation 5
            <br />
            by the hour
            <span className="mt-1 block text-[0.56em] font-normal tracking-[-0.03em] text-dim">
              in {site.address.locality}, {site.address.city}
            </span>
          </h1>

          {/*
            The rate at the second-largest size on the page. Figures in mono,
            the condition attached to each in dim — a price is never quoted here
            without the hour it applies to.
          */}
          <dl className="flex flex-col gap-1.5 text-[clamp(1.05rem,1.6vw,1.3rem)]">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <dt className="font-mono tabular-nums text-paper">₹{cheapestHour} an hour</dt>
              <dd className="m-0 text-dim">{cheapestHourWhen}</dd>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <dt className="font-mono tabular-nums text-paper">₹{standardHour}</dt>
              <dd className="m-0 text-dim">after 5 pm</dd>
            </div>
          </dl>

          <p className="text-[0.95rem] text-dim">Walk in, or hold a bay on WhatsApp.</p>

          <div className="flex flex-wrap gap-3">
            <BookButton size="lg" />
            <ButtonLink href="/pricing" variant="ghost" size="lg">
              See all rates
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* the three facts that decide whether someone comes, on one rule */}
      <div className="relative z-10 border-t border-edge">
        <dl className="shell grid gap-x-10 gap-y-4 py-6 text-[0.88rem] sm:grid-cols-3">
          <div>
            <dt className="sr-only">The room</dt>
            <dd className="m-0 text-dim">
              <span className="font-mono tabular-nums text-paper">{site.bays}</span> bays ·{' '}
              <span className="font-mono tabular-nums text-paper">{seats}</span> seats
            </dd>
          </div>
          <div>
            <dt className="sr-only">Rating</dt>
            <dd className="m-0 text-dim">
              <span className="font-mono tabular-nums text-paper">{site.rating.value}</span> from{' '}
              <span className="font-mono tabular-nums text-paper">{site.rating.count}</span> Google
              reviews
            </dd>
          </div>
          <div>
            <dt className="sr-only">Getting here</dt>
            <dd className="m-0 text-dim">
              <span className="font-mono tabular-nums text-paper">3 min</span> from Ramwadi metro
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
