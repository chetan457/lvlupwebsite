import Link from 'next/link';

import { BookButton } from '@/components/book-button';
import { addressLines, site } from '@/content/site';

const footerLinks = [
  { href: '/#bays', label: 'Bays' },
  { href: '/#games', label: 'Games' },
  { href: '/pricing', label: 'Rates' },
  { href: '/pricing#parties', label: 'Parties' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    /* pb-28 clears the fixed mobile dock; at lg the dock is gone and so is the padding */
    <footer className="border-t border-edge bg-room-deep pt-[clamp(2.75rem,6vw,4rem)] pb-28 lg:pb-14">
      <div className="shell">
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(0,1fr)]">
          <div className="flex flex-col items-start gap-5">
            <Link
              href="/"
              className="-mx-1 inline-flex min-h-11 items-center px-1 text-[1.35rem] font-semibold tracking-[-0.03em] text-paper"
            >
              Lvl<span className="text-accent">Up</span>
            </Link>
            <p className="max-w-[34ch] text-[0.95rem] text-dim">
              {site.bays} bays, {site.seats} seats, {site.tagline}. Message us and we
              will hold one.
            </p>
            <BookButton>Book a bay</BookButton>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow mb-4">Pages</p>
            <ul className="flex flex-col gap-1">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="-mx-2 inline-flex min-h-11 items-center px-2 text-[0.95rem] text-dim transition-colors duration-200 hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow mb-4">Find us</p>
            <address className="flex flex-col gap-1 not-italic text-[0.95rem] text-dim">
              {addressLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <span className="text-dim">{site.landmark}</span>
              <a
                href={`tel:${site.phone}`}
                className="-mx-2 mt-2 inline-flex min-h-11 items-center px-2 font-mono text-[0.95rem] text-paper transition-colors duration-200 hover:text-accent"
              >
                {site.phoneDisplay}
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="-mx-2 inline-flex min-h-11 items-center px-2 text-[0.95rem] text-dim transition-colors duration-200 hover:text-paper"
              >
                {site.instagramHandle} on Instagram — pictures of the actual room
              </a>
            </address>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-edge pt-6 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-[62ch] font-mono text-[0.7rem] leading-relaxed text-dim">
            Placeholder site. The photos, rates, reviews and address are stand-ins.
          </p>
          <p className="font-mono text-[0.7rem] text-dim sm:text-right">
            &copy; {year} {site.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
