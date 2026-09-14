import Link from 'next/link';

import { BookButton } from '@/components/book-button';

/** Six links is the whole site. Anything else belongs in the footer. */
const navLinks = [
  { href: '/#bays', label: 'Bays' },
  { href: '/#games', label: 'Games' },
  { href: '/pricing', label: 'Rates' },
  { href: '/pricing#parties', label: 'Parties' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  return (
    <header className="glass sticky top-0 z-40 rounded-none border-x-0 border-t-0">
      <div className="shell grid grid-cols-[auto_1fr] items-center gap-x-8 py-2.5">
        <Link
          href="/"
          className="-mx-1 inline-flex min-h-11 items-center px-1 text-[1.15rem] font-semibold tracking-[-0.03em] text-paper"
        >
          Lvl<span className="text-accent">Up</span>
        </Link>

        <div className="flex items-center justify-end gap-1">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center rounded-lg px-3 text-[0.92rem] text-dim transition-colors duration-200 hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* below lg the fixed dock already carries this call to action */}
          <div className="ml-3 hidden lg:block">
          <BookButton>Book a bay</BookButton>
          </div>
        </div>
      </div>
    </header>
  );
}
