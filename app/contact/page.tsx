import type { Metadata } from 'next';

import { BookingForm } from '@/components/booking-form';
import { FindUs } from '@/components/find-us';
import { site } from '@/content/site';
import { buyout, payment } from '@/content/pricing';
import { cheapestHour, cheapestHourWhen, standardHour } from '@/content/pricing';
import { breadcrumbSchema, jsonLd } from '@/lib/schema';

/** Renders the week with today marked, so it cannot be frozen at build time. */
export const revalidate = 600;

export const metadata: Metadata = {
  title: 'Contact and booking',
  description: `Book a PS5 bay at ${site.name}, ${site.address.locality}, ${site.address.city}. Message us on WhatsApp for the quickest reply, or send the date, time and number of players and we will confirm the slot.`,
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    title: `Contact and booking — ${site.name}`,
    description: `Hold a bay at ${site.name} in ${site.address.locality}. WhatsApp, call, or send the form.`,
    url: `${site.url}/contact`,
    // declaring openGraph here replaces the root's, so the shared card has to be named again
    images: ['/opengraph-image'],
  },
};

/** The three things people ask at the counter before they commit. */
const terms = [
  { label: 'Reply time', value: 'On WhatsApp, usually within the hour while we are open.' },
  { label: 'Payment', value: payment.methods },
  { label: 'Changed plans', value: payment.cancellation },
];

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-edge bg-room pb-[clamp(3.25rem,7vw,5.5rem)] pt-[clamp(3.5rem,8vw,6rem)]">
        <div className="shell grid gap-[clamp(2.25rem,5vw,3.5rem)] lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
          {/* Sticky on wide screens so the terms stay beside the field the
              visitor is filling, instead of scrolling away at the top. */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24">
            <p className="eyebrow">Bookings</p>
            <h1 className="max-w-[14ch] text-[clamp(2rem,5vw,3rem)]">Hold a bay before you come</h1>
            <p className="max-w-[46ch] text-[1.02rem] text-dim">
              Walk-ins get whatever is free, which on a Saturday evening is often nothing. An hour
              starts at{' '}
              <span className="font-mono text-paper">₹{cheapestHour}</span> {cheapestHourWhen}, and{' '}
              <span className="font-mono text-paper">₹{standardHour}</span> after 5 pm. Taking the whole room
              starts at{' '}
              <span className="font-mono text-paper">₹{buyout.rate.toLocaleString('en-IN')}</span> an
              hour, with a{' '}
              <span className="font-mono text-paper">{buyout.minimumHours}</span>-hour minimum.
            </p>

            <dl className="flex flex-col divide-y divide-edge border-y border-edge">
              {terms.map((term) => (
                <div key={term.label} className="grid gap-1 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                  <dt className="eyebrow">{term.label}</dt>
                  <dd className="max-w-[42ch] text-[0.92rem] text-dim">{term.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <BookingForm />
        </div>
      </section>

      <FindUs />

      <script
        type="application/ld+json"
        // built from local content only; nothing here comes from the form
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Contact and booking', path: '/contact' },
            ]),
          ),
        }}
      />
    </>
  );
}
