import { ButtonLink } from '@/components/ui/button';
import { site, whatsappLink, bookingMessage } from '@/content/site';
import { cheapestHour } from '@/content/pricing';

/**
 * A 404 has one job: get the visitor to the two pages they were probably
 * looking for. The address sits underneath because a dead link is often
 * someone's second attempt at finding the place at all.
 */
export default function NotFound() {
  return (
    <section className="border-b border-edge bg-room py-[clamp(4rem,12vw,8rem)]">
      <div className="shell">
        <div className="grid items-start gap-x-14 gap-y-8 md:grid-cols-[minmax(0,auto)_minmax(0,32rem)]">
          <p
            aria-hidden="true"
            className="font-mono text-[clamp(4.5rem,16vw,9rem)] leading-none tracking-[-0.05em] text-dimmer"
          >
            404
          </p>

          <div className="flex flex-col gap-6">
            <p className="eyebrow">Page not found</p>
            <h1 className="max-w-[16ch] text-[clamp(1.9rem,4.4vw,2.9rem)]">
              This page isn&rsquo;t here any more.
            </h1>
            <p className="max-w-[46ch] text-[1rem] text-dim">
              Either the link is old or something got mistyped. Nothing is broken at our end
              &mdash; the bays are open and the rates are where they always were.
            </p>

            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/" size="lg">
                See the bays
              </ButtonLink>
              <ButtonLink href="/pricing" variant="ghost" size="lg">
                Rate card, from <span className="font-mono">₹{cheapestHour}</span>/hr
              </ButtonLink>
            </div>

            <div className="mt-2 flex flex-col gap-2 border-t border-edge pt-6 text-[0.9rem] text-dim">
              <p>
                {site.address.line1}, {site.address.line2}. {site.landmark}.
              </p>
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <a
                  href={`tel:${site.phone}`}
                  className="inline-flex min-h-11 items-center font-mono text-paper underline decoration-edge-hi underline-offset-4 hover:decoration-lamp"
                >
                  {site.phoneDisplay}
                </a>
                <a
                  href={whatsappLink(bookingMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center text-paper underline decoration-edge-hi underline-offset-4 hover:decoration-lamp"
                >
                  WhatsApp us instead
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
