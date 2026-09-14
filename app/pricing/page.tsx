import type { Metadata } from 'next';

import { Buyout } from '@/components/buyout';
import { PricingTable, rupees } from '@/components/pricing-table';
import { ButtonLink } from '@/components/ui/button';
import { Band, BandHead } from '@/components/ui/section';
import {
  included,
  notIncluded,
  passes,
  payment,
  rates,
  tournament,
} from '@/content/pricing';
import { faqs } from '@/content/reviews';
import { bookingMessage, site, whatsappLink } from '@/content/site';
import { lowestRate } from '@/content/stations';
import { faqSchema, jsonLd, tournamentSchema } from '@/lib/schema';

const offPeak = rates.find((r) => r.id === 'off-peak');

export const metadata: Metadata = {
  title: 'Rates and passes',
  description: `PS5 by the hour in ${site.address.locality}, ${site.address.city}, from ₹${lowestRate} a bay. Cheaper weekday afternoons, 3 prepaid passes and a whole-lounge rate for parties.`,
  alternates: { canonical: '/pricing' },
  openGraph: {
    type: 'website',
    url: `${site.url}/pricing`,
    title: `Rates and passes — ${site.name}`,
    description: `PS5 bays from ₹${lowestRate} an hour in ${site.address.locality}, ${site.address.city}.`,
    // declaring openGraph here replaces the root's, so the shared card has to be named again
    images: ['/opengraph-image'],
  },
};

/** Small mono figure with its unit set quieter beside it. */
function Figure({ value, unit }: { value: string; unit?: string }) {
  return (
    <span className="font-mono tabular-nums text-paper">
      {value}
      {unit ? <span className="text-dim">{unit}</span> : null}
    </span>
  );
}

function Check() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[0.3rem] size-4 shrink-0 text-accent"
      aria-hidden="true"
    >
      <path d="m4 12.5 5 5L20 6.5" />
    </svg>
  );
}

function Cross() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-[0.3rem] size-4 shrink-0 text-dim"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="border-b border-edge bg-room-deep pt-[clamp(3rem,8vw,5rem)] pb-[clamp(2.5rem,6vw,4rem)]">
        <div className="shell grid gap-x-10 gap-y-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">Rates</p>
            <h1 className="max-w-[15ch] text-[clamp(2.1rem,6vw,3.4rem)]">
              What an hour here costs
            </h1>
            <p className="max-w-[52ch] text-[1.02rem] text-dim">
              One figure per bay, not per head. The rate card is per hour; the passes,
              the party advance and the bracket entry are totals.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-1 md:justify-items-end md:text-right">
            <div>
              <dt className="eyebrow">Cheapest hour</dt>
              <dd className="mt-1 text-[1.6rem]">
                <Figure value={rupees(offPeak ? offPeak.amount : lowestRate)} unit="/hr" />
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Standard</dt>
              <dd className="mt-1 text-[1.6rem]">
                <Figure value={rupees(lowestRate)} unit="/hr" />
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <Band id="rates">
        <BandHead eyebrow="01 / By the hour" title="Every standard bay is the same rate">
          Weekday evenings and weekends cost more because the room is full. The
          recliner costs more because it is the one people ask for by name.
        </BandHead>
        <PricingTable />
        <p className="mt-5 max-w-[58ch] text-[0.9rem] text-dim">
          Sessions are billed in half-hour steps after the first hour. If a bay is
          free when your hour ends, staying on is a conversation, not a rebooking.
        </p>
      </Band>

      <Band id="off-peak" className="bg-room-deep">
        <BandHead eyebrow="02 / The dead zone" title="Weekday afternoons are cheaper">
          {offPeak ? offPeak.when : 'Mon–Fri, 1–5 pm.'}
        </BandHead>
        <div className="grid gap-x-12 gap-y-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)]">
          <div className="flex flex-col gap-4 text-[1rem] text-dim">
            <p>
              Between 1 and 5 on a weekday the room is mostly empty. The rent is
              paid either way, the air conditioning is already running, and an empty
              chair earns nothing — so those hours are sold for less rather than sold
              to nobody.
            </p>
            <p>
              It is the same PS5, the same screens and the same controllers as an
              8&nbsp;pm Saturday. The only difference is who else is in the room.
              Students and anyone on a rotating shift more or less live here.
            </p>
          </div>

          <div className="glass rounded-card p-6">
            <p className="eyebrow">Standard bay</p>
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-mono text-[2.4rem] leading-none tabular-nums text-accent">
                {rupees(offPeak ? offPeak.amount : 90)}
              </span>
              <span className="font-mono text-[1.05rem] tabular-nums text-dim line-through">
                {rupees(lowestRate)}
              </span>
            </div>
            <p className="mt-3 text-[0.9rem] text-dim">
              per hour, Monday to Friday, 1–5&nbsp;pm
            </p>
            <p className="mt-5 border-t border-edge pt-4 text-[0.9rem] text-dim">
              2 hours on a bay comes to{' '}
              <span className="font-mono tabular-nums text-paper">
                {rupees((offPeak ? offPeak.amount : 90) * 2)}
              </span>.
            </p>
          </div>
        </div>
      </Band>

      <Band id="passes">
        <BandHead eyebrow="03 / Passes" title="Pay ahead, pay less">
          3 prepaid blocks. Each one is a lower hourly rate bought in advance —
          there is no membership, no card and nothing to renew.
        </BandHead>
        <ul className="border-t border-edge">
          {passes.map((pass) => (
            <li
              key={pass.id}
              className="grid items-baseline gap-x-8 gap-y-2 border-b border-edge py-6 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_auto]"
            >
              <h3 className="text-[1.15rem]">{pass.name}</h3>
              <div className="text-[0.95rem] text-dim">
                <p>{pass.includes}</p>
                <p className="mt-1">
                  Valid <span className="font-mono tabular-nums text-paper">{pass.validity}</span>{' '}
                  from the day you buy it.
                </p>
              </div>
              <div className="md:text-right">
                <p className="text-[1.5rem] leading-none">
                  <Figure value={rupees(pass.price)} />
                </p>
                <p className="mt-2 font-mono text-[0.8rem] tabular-nums text-accent">
                  {pass.saving}
                </p>
              </div>
            </li>
          ))}
        </ul>
        {/* the 9-hour break-even is arithmetic on the figures above; recheck it
            when the pass prices are replaced */}
        <p className="mt-5 max-w-[58ch] text-[0.9rem] text-dim">
          The 10-hour pass costs less than 9 standard hours bought one at a time, so
          it is ahead before you have finished it. Each row says what its hours cover.
          Passes are per person and hours come off at the counter; unused hours expire
          on the date printed, and we will remind you on WhatsApp a week before.
        </p>
      </Band>

      {/* the cancellation line lives in band 07 on this page, so it is off here */}
      <Buyout eyebrow="04 / The whole room" showCancellation={false} />

      <Band id="tournament">
        <BandHead eyebrow="05 / The bracket" title={tournament.name}>
          Sign up at the counter or on WhatsApp. Entries close when the 16th name goes
          on the sheet.
        </BandHead>
        <div className="grid gap-x-12 gap-y-8 rounded-card border border-edge bg-surface p-[clamp(1.25rem,3vw,2rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
          <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="eyebrow">Format</dt>
              <dd className="mt-2 text-[0.95rem] text-paper">{tournament.format}</dd>
            </div>
            <div>
              <dt className="eyebrow">When</dt>
              <dd className="mt-2 font-mono text-[0.95rem] tabular-nums text-paper">
                {tournament.when}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Entry</dt>
              <dd className="mt-2 text-[1.4rem] leading-none">
                <Figure value={rupees(tournament.entry)} />
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Prize</dt>
              <dd className="mt-2 text-[0.95rem] text-paper">{tournament.prize}</dd>
            </div>
          </dl>
          <div className="flex flex-col items-start justify-end gap-4">
            <p className="text-[0.9rem] text-dim">
              Entry covers your bracket runs only. Casual hours before or after the
              bracket bill at the weekend rate.
            </p>
            <ButtonLink
              href={whatsappLink(
                `Hi ${site.name}, I want an entry for the ${tournament.name}. `,
              )}
              variant="ghost"
            >
              Put my name down
            </ButtonLink>
          </div>
        </div>
      </Band>

      <Band id="included" className="bg-room-deep">
        <BandHead eyebrow="06 / The fine print" title="What the hour covers">
          Nothing below is a surprise at the counter. If it is not listed as costing
          extra, the hour already covers it.
        </BandHead>
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div>
            <h3 className="text-[1.1rem]">Included in the hour</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {included.map((item) => (
                <li key={item} className="flex gap-3 text-[0.95rem] text-dim">
                  <Check />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[1.1rem]">Costs extra</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {notIncluded.map((item) => (
                <li key={item} className="flex gap-3 text-[0.95rem] text-dim">
                  <Cross />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      <Band id="payment">
        <BandHead eyebrow="07 / Paying" title="How to pay, how to cancel">
          Only a pass or a party advance is taken up front. A bay booking costs
          nothing to walk away from.
        </BandHead>
        <div className="grid gap-x-12 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-card border border-edge bg-surface p-6">
            <h3 className="text-[1.05rem]">Payment</h3>
            <p className="mt-3 text-[0.95rem] text-dim">{payment.methods}</p>
          </div>
          <div className="rounded-card border border-edge bg-surface p-6">
            <h3 className="text-[1.05rem]">Cancellation</h3>
            <p className="mt-3 text-[0.95rem] text-dim">{payment.cancellation}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ButtonLink href={whatsappLink(bookingMessage)} size="lg">
            Book a bay on WhatsApp
          </ButtonLink>
          <ButtonLink href={`tel:${site.phone}`} variant="ghost" size="lg">
            {site.phoneDisplay}
          </ButtonLink>
        </div>
      </Band>

      <Band id="faq">
        <BandHead eyebrow="08 / Questions" title="Asked at the counter most days" />
        <div className="border-t border-edge">
          {faqs.map((faq) => (
            /* native details — an accordion is not worth a client component */
            <details key={faq.question} className="group border-b border-edge">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1rem] font-medium text-paper [&::-webkit-details-marker]:hidden">
                {faq.question}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5 shrink-0 text-dim transition-transform duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-180 motion-reduce:transition-none"
                  aria-hidden="true"
                >
                  <path d="m6 9.5 6 6 6-6" />
                </svg>
              </summary>
              <p className="max-w-[62ch] pb-5 text-[0.95rem] text-dim">{faq.answer}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 max-w-[46ch] text-[0.95rem] text-dim">
          Still unsure, ask us. We answer while the counter is open.
        </p>
        <div className="mt-5">
          <ButtonLink href={whatsappLink(bookingMessage)} size="lg">
            Book a bay on WhatsApp
          </ButtonLink>
        </div>
      </Band>

      <script
        type="application/ld+json"
        // payload is built from local static content, never from visitor input
        dangerouslySetInnerHTML={{ __html: jsonLd(faqSchema()) }}
      />
      <script
        type="application/ld+json"
        // payload is built from local static content, never from visitor input
        dangerouslySetInnerHTML={{ __html: jsonLd(tournamentSchema()) }}
      />
    </>
  );
}
