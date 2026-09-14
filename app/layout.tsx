import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { MobileDock } from '@/components/mobile-dock';
import { site } from '@/content/site';
import { jsonLd, localBusinessSchema } from '@/lib/schema';

import './globals.css';

const sans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-sans',
  // trims the flash of unstyled text without a layout shift on swap
  adjustFontFallback: true,
});

const mono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
  // Both faces preload, both swap. Measured alternatives, both worse:
  // preload:false on this face pushed FCP 1.1s -> 1.4s and introduced CLS;
  // display:'optional' on both moved nothing and costs the typeface entirely
  // on a slow connection.
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline} in ${site.address.locality}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'PS5 gaming lounge',
    `gaming cafe ${site.address.city}`,
    `PS5 on rent ${site.address.locality}`,
    'PlayStation 5 by the hour',
    'gaming cafe near me',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline} in ${site.address.locality}`,
    description: site.description,
  },
  // title/description are deliberately absent: Next fills them per page from
  // that page's openGraph, so /pricing does not tweet the home page's copy.
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: true, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: '#050608',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // the dock's env(safe-area-inset-bottom) is inert without this
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-IN"
      /*
        Midnight is the only palette on show for now. Embers still exists in
        globals.css and components/theme-toggle.tsx — swapping this attribute
        back to "embers", or re-mounting <ThemeToggle />, brings it back.
      */
      data-theme="midnight"
      className={`${sans.variable} ${mono.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-lamp focus:px-4 focus:py-2 focus:font-medium focus:text-lamp-ink"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
        <MobileDock />
        <script
          type="application/ld+json"
          // content is local and static; nothing here is visitor-supplied
          dangerouslySetInnerHTML={{ __html: jsonLd(localBusinessSchema()) }}
        />
      </body>
    </html>
  );
}
