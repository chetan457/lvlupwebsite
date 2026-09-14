import Image from 'next/image';

import { BookButton } from '@/components/book-button';
import { Band, BandHead } from '@/components/ui/section';
import { photoSrc, photos } from '@/content/images';
import { liveStations, soonStations, type Station } from '@/content/stations';

/**
 * Twelve columns, two rows, both filled exactly: 7 + 5, then 3 + 3 + 6.
 *
 * The earlier version derived spans from seat count, which left two of six
 * columns empty on the last two rows and read as a broken grid rather than a
 * deliberate ragged edge.
 *
 * Only the feature bay carries a photograph. Four stock photos of controllers
 * are noise — none of them is this venue, they arrive at four different
 * brightnesses, and a white console on a white ground punches a hole in a dark
 * grid. One cinematic frame on the tile that deserves emphasis, and the rest
 * carry their own weight typographically: the rate is the loud element.
 */

const RATE = 'font-mono tabular-nums tracking-[-0.03em] text-accent';

function Rate({ amount, size = 'md' }: { amount: number; size?: 'md' | 'lg' }) {
  return (
    <p className={`${RATE} whitespace-nowrap ${size === 'lg' ? 'text-[1.6rem]' : 'text-[1.25rem]'}`}>
      ₹{amount}
      <span className="text-[0.72rem] font-normal text-dim">/hr</span>
    </p>
  );
}

function Specs({ specs, lit = false }: { specs: string[]; lit?: boolean }) {
  return (
    <ul className="mt-auto flex flex-wrap gap-[0.4rem] pt-1">
      {specs.map((spec) => (
        <li
          key={spec}
          className={`rounded-md border px-2 py-[0.22rem] font-mono text-[0.72rem] ${
            lit ? 'border-[var(--glow-accent)] text-accent-mute' : 'border-edge text-dim'
          }`}
        >
          {spec}
        </li>
      ))}
    </ul>
  );
}

/** The bay that goes first at the weekend, so it gets the photograph and the room. */
function FeatureTile({ station }: { station: Station }) {
  const photo = photos[station.photo];

  return (
    <article className="lit group relative isolate flex min-h-[17rem] lg:min-h-[19rem] flex-col justify-end overflow-hidden rounded-card border border-edge lg:col-span-7">
      <div className="absolute inset-0 -z-10">
        <Image
          src={photoSrc(photo, 1200, 800)}
          alt=""
          fill
          loading="lazy"
          sizes="(max-width: 64rem) 100vw, 46rem"
          placeholder="blur"
          blurDataURL={photo.blur}
          className="object-cover object-[50%_30%] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'linear-gradient(to top, rgb(var(--ch-room) / 0.45) 0%, rgb(var(--ch-room) / 0.2) 55%, rgb(var(--ch-room) / 0.3) 100%)',
          }}
        />
      </div>

      {/*
        The scrim is anchored to the copy, not to the tile. A tile-wide gradient
        cannot promise contrast over a specular highlight, and these photographs
        get replaced by the venue's own — so legibility here has to be a
        property of the block rather than of the picture.
      */}
      <div
        className="relative flex flex-col gap-3 p-[clamp(1.15rem,2.5vw,1.6rem)] pt-14"
        style={{
          background:
            'linear-gradient(to top, rgb(var(--ch-room)) 0%, rgb(var(--ch-room) / 0.96) 62%, rgb(var(--ch-room) / 0) 100%)',
        }}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-[1.45rem]">{station.name}</h3>
          <Rate amount={station.rate as number} size="lg" />
        </div>
        <p className="max-w-[46ch] text-[0.9rem] text-paper/80">{station.blurb}</p>
        <Specs specs={station.specs} lit />
      </div>
    </article>
  );
}

function BayTile({ station, span }: { station: Station; span: string }) {
  return (
    <article
      className={`lit-hover flex flex-col gap-[0.7rem] rounded-card border border-edge bg-surface p-[clamp(1.15rem,2.2vw,1.4rem)] transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-edge-hi ${span}`}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[1.12rem]">{station.name}</h3>
        <Rate amount={station.rate as number} />
      </div>
      <p className="text-[0.88rem] text-dim">{station.blurb}</p>
      <Specs specs={station.specs} />
    </article>
  );
}

/**
 * Both unbuilt stations in one tile. As two separate cards they were two
 * half-empty boxes announcing an absence twice; together they read as one
 * honest note about what is coming.
 */
function ComingSoon({ stations }: { stations: Station[] }) {
  return (
    <article className="flex flex-col gap-4 rounded-card border border-dashed border-edge p-[clamp(1.15rem,2.2vw,1.4rem)] lg:col-span-6">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[1.12rem] text-dim">Not bookable yet</h3>
        <span className="whitespace-nowrap rounded-full border border-edge px-[0.55rem] py-[0.18rem] font-mono text-[0.66rem] uppercase tracking-[0.14em] text-dim">
          Later this year
        </span>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {stations.map((station) => (
          <li key={station.id} className="flex flex-col gap-2 border-t border-edge pt-3">
            <p className="text-[0.98rem] text-paper/70">{station.name}</p>
            <p className="text-[0.85rem] leading-snug text-dim">{station.blurb}</p>
            <Specs specs={station.specs} />
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Stations() {
  const [feature, ...rest] = liveStations;
  const [pair, ...singles] = rest;

  return (
    <Band id="bays">
      <BandHead eyebrow="01 / The bays" title="Pick the bay that suits your night">
        PlayStation 5 only for now. The racing rig and the PC bay are being built and will open
        later this year. Every bay is cleaned between sessions, controllers charged, games patched.
      </BandHead>

      <div className="grid grid-cols-1 gap-[0.9rem] lg:grid-cols-12">
        <FeatureTile station={feature} />
        <BayTile station={pair} span="lg:col-span-5" />
        {singles.map((station) => (
          <BayTile key={station.id} station={station} span="lg:col-span-3" />
        ))}
        <ComingSoon stations={soonStations} />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
        <BookButton>Ask for a bay</BookButton>
        <p className="max-w-[42ch] text-[0.85rem] text-dim">
          Tell us which bay you want and we will hold it. On a weekend evening that is worth doing.
        </p>
      </div>
    </Band>
  );
}
