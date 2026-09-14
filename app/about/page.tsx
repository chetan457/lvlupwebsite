import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { Gallery } from '@/components/gallery';
import { ButtonLink } from '@/components/ui/button';
import { Band, BandHead } from '@/components/ui/section';
import { houseRules } from '@/content/reviews';
import { bookingMessage, site, whatsappLink } from '@/content/site';
import { liveStations, soonStations, stations } from '@/content/stations';
import { cheapestHour } from '@/content/pricing';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'About the lounge',
  description:
    'Who runs the PS5 room above the bakery in Kalyani Nagar, what is actually in it — consoles, panel sizes, seating, controllers, line speed — and the 4 house rules worth reading before you turn up.',
  alternates: { canonical: '/about' },
  openGraph: {
    type: 'website',
    title: `About ${site.name}`,
    description:
      'The room, the kit list and the house rules, written out before you arrive rather than after.',
    url: `${site.url}/about`,
    // declaring openGraph here replaces the root's, so the shared card has to be named again
    images: ['/opengraph-image'],
  },
};

/* Everything below is read off content/stations.ts so the spec sheet cannot
   contradict the bay listings on the home page. */
const totalSeats = liveStations.reduce((count, station) => count + station.seats, 0);
const panels = Array.from(
  new Set(liveStations.flatMap((station) => station.specs).filter((spec) => spec.includes('"'))),
);
const recliner = stations.find((station) => station.id === 'recliner');
const proStation = liveStations.find((station) =>
  station.specs.some((spec) => spec.includes('Pro')),
);

/** A figure in prose gets mono numerals, same as the rate card. */
function Num({ children }: { children: ReactNode }) {
  return <span className="font-mono">{children}</span>;
}

type Spec = { label: string; value: ReactNode };

const specs: Spec[] = [
  {
    label: 'Consoles',
    value: (
      <>
        <Num>{site.bays}</Num> PlayStation 5s, one per bay, all on the shop&rsquo;s own PSN account
        so nothing asks you to sign in.
        {proStation ? (
          <>
            {' '}
            The one in {proStation.name} is a Pro.
          </>
        ) : null}
      </>
    ),
  },
  {
    label: 'Panels',
    value: (
      <ul className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {panels.map((panel) => (
          <li
            key={panel}
            className="border-l border-edge-hi pl-3 font-mono text-[0.85rem] text-paper first:border-l-0 first:pl-0"
          >
            {panel}
          </li>
        ))}
      </ul>
    ),
  },
  {
    label: 'Seating',
    value: (
      <>
        <Num>{totalSeats}</Num> seats across <Num>{site.bays}</Num> bays, and the rate is per bay —
        a second person on the same screen costs nothing.
        {recliner ? (
          <>
            {' '}
            <Num>{recliner.seats}</Num> of those seats are the full recliners in {recliner.name}.
          </>
        ) : null}
      </>
    ),
  },
  {
    label: 'Controllers',
    value: (
      <>
        Official DualSense pads only, never third-party clones. <Num>4</Num> at the paired bays,{' '}
        <Num>2</Num> everywhere else, all charged between sessions and wiped down at close.
      </>
    ),
  },
  {
    label: 'Sound',
    value: (
      <>
        A sound bar in {recliner ? recliner.name : 'the corner bay'}. Wired headsets for the other
        bays, ₹<Num>20</Num> a session at the counter, so the match next to you stays out of yours.
      </>
    ),
  },
  {
    label: 'Internet',
    value: (
      <>
        <Num>200</Num> Mbps fibre, and every console is on cable rather than wi-fi. A day-one patch
        downloading on one bay does not slow the rest of the room.
      </>
    ),
  },
  {
    label: 'Power',
    value: (
      <>
        The whole floor sits behind an inverter. A cut on the lane does not end your session or
        corrupt a save.
      </>
    ),
  },
  {
    label: 'Being built',
    value: (
      <>
        {soonStations.map((station) => station.name).join(' and ')} — announced, not bookable, and
        not on the rate card until they work.
      </>
    ),
  },
];

const facts = [
  { label: 'Bays', value: String(site.bays) },
  { label: 'Seats', value: String(site.seats) },
  { label: 'From', value: `₹${cheapestHour}/hr` },
  { label: 'Google', value: `${site.rating.value} · ${site.rating.count}` },
];

export default function AboutPage() {
  return (
    <>
      <Band id="story">
        <div className="grid gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">01 / The story</p>
            <h1 className="mt-3 max-w-[16ch] text-[clamp(2rem,5.2vw,3.25rem)]">
              Why there is a PS5 room above the bakery
            </h1>

            <div className="mt-8 flex max-w-[58ch] flex-col gap-5 text-[1.02rem] text-dim">
              <p>
                I did not plan to run a gaming lounge. I planned to stop hosting one in my flat. For
                about <Num>4</Num> years my living room in {site.address.locality} was where{' '}
                <Num>6</Num> people turned up with <Num>2</Num> controllers, and someone was always
                on the floor at an angle where the goalkeeper was a smudge.
              </p>
              <p>
                The nearest place that rented screens by the hour had PCs, a queue and nobody who
                could tell you whether the game you wanted was installed. So I took the first-floor
                shop I was already walking past every week — {site.landmark} — knocked out one wall,
                and opened with <Num>3</Num> bays, a whiteboard for bookings and no website at all.
              </p>
              <p>
                <Num>2</Num> years on there are <Num>{site.bays}</Num> bays and{' '}
                <Num>{site.seats}</Num> seats. Almost everything that changed came from someone complaining at the counter.
                The folding chairs were miserable after an hour, so the recliners went in. Headsets
                are no fun when you came with a friend, so the corner bay got a sound bar. A
                fighting-game regular sat me down and showed me the difference on his own console,
                so the recliner and the paired bays got <Num>120</Num>Hz panels.
              </p>
              <p>
                I still take most of the bookings myself in the evenings. That is why the number on
                this site opens a WhatsApp chat with a person rather than a form that emails someone
                on Monday.
              </p>
            </div>
          </div>

          <aside className="glass h-fit rounded-card p-6 lg:col-span-4 lg:col-start-9">
            <h2 className="eyebrow">The room, in figures</h2>
            <dl className="mt-5 flex flex-col">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex items-baseline justify-between gap-4 border-b border-edge py-3 last:border-b-0 last:pb-0"
                >
                  <dt className="text-[0.9rem] text-dim">{fact.label}</dt>
                  <dd className="font-mono text-[1.05rem] text-paper">{fact.value}</dd>
                </div>
              ))}
            </dl>
            {/* hand-kept, mirrors content/hours.ts — update both together */}
            <p className="mt-5 text-[0.88rem] leading-relaxed text-dim">
              Open <Num>7</Num> days. Weekdays from <Num>1</Num> pm, weekends from <Num>11</Num> am,
              and late every night.
            </p>
            <p className="mt-2 font-mono text-[0.75rem] text-dim">{site.transit}</p>
          </aside>
        </div>
      </Band>

      <Band id="setup" className="bg-room-deep">
        <BandHead eyebrow="02 / The setup" title="The kit list, before you ask">
          The questions people actually message about, answered once. If a spec is not here, it is
          because I do not have it yet.
        </BandHead>

        <dl className="border-t border-edge">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="grid gap-x-10 gap-y-2 border-b border-edge py-5 md:grid-cols-[12rem_1fr]"
            >
              <dt className="eyebrow pt-1">{spec.label}</dt>
              <dd className="max-w-[62ch] text-[0.97rem] text-dim">{spec.value}</dd>
            </div>
          ))}
        </dl>
      </Band>

      <Band id="house-rules">
        <div className="grid gap-x-10 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">03 / House rules</p>
            <h2 className="mt-3 max-w-[14ch] text-[clamp(1.6rem,3.2vw,2.25rem)]">
              Worth knowing before you climb the stairs
            </h2>
            <p className="mt-5 max-w-[42ch] text-[0.95rem] text-dim">
              There are <Num>{houseRules.length}</Num> of them and they have not changed in{' '}
              <Num>2</Num> years. Nobody likes hearing a rule for the first time at the counter, so
              here they are in advance.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={whatsappLink(bookingMessage)} external>
                Book on WhatsApp
              </ButtonLink>
              <ButtonLink href="/pricing" variant="ghost">
                See the rates
              </ButtonLink>
            </div>
          </div>

          <ol className="flex flex-col lg:col-span-6 lg:col-start-7">
            {houseRules.map((rule, index) => (
              <li
                key={rule}
                className="flex gap-5 border-b border-edge py-4 first:border-t"
              >
                <span aria-hidden="true" className="font-mono text-[0.8rem] text-accent">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="max-w-[46ch] text-[0.97rem] text-dim">{rule}</span>
              </li>
            ))}
          </ol>
        </div>
      </Band>

      <Gallery />

      <Band id="visit">
        <div className="flex flex-col items-start gap-5">
          <p className="max-w-[38ch] text-[1.02rem] text-dim">
            That is the room. Message me and I will hold a bay.
          </p>
          <ButtonLink href={whatsappLink(bookingMessage)} size="lg" external>
            Book on WhatsApp
          </ButtonLink>
        </div>
      </Band>

      <script
        type="application/ld+json"
        // built from local content only; nothing here is visitor-supplied
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'About', path: '/about' },
            ]),
          ),
        }}
      />
    </>
  );
}
