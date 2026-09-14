import type { Metadata } from 'next';

import { ChapterRail } from '@/components/chapter-rail';
import { Hero } from '@/components/hero';
import { Stations } from '@/components/stations';
import { GamesShelf } from '@/components/games-shelf';
import { RatesStrip } from '@/components/rates-strip';
import { Buyout } from '@/components/buyout';
import { Reviews } from '@/components/reviews';
import { FindUs } from '@/components/find-us';
import { jsonLd, reviewsSchema } from '@/lib/schema';

export const metadata: Metadata = {
  // set here rather than in the layout, so a 404 does not claim to be the home page
  alternates: { canonical: '/' },
};

/**
 * Statically rendered, then refreshed every ten minutes so the open/closed
 * badge and the highlighted day are never more than that far behind. The badge
 * also re-checks in the browser after hydration — this bound is for the first
 * paint and for anyone with JavaScript off.
 */
export const revalidate = 600;

/**
 * Order is a commercial argument, not a layout preference.
 *
 * Bays and games answer the two questions that decide whether someone comes at
 * all. Rates come next because it is the figure people screenshot. The
 * whole-room buyout sits above reviews on purpose: one party booking is worth
 * roughly forty walk-in hours, so it does not belong below the fold twice over.
 */
export default function HomePage() {
  return (
    <>
      <ChapterRail />
      <Hero />
      <Stations />
      <GamesShelf />
      <RatesStrip />
      <Buyout />
      <Reviews />
      {/*
        Rating markup rides with the visible reviews and nowhere else. Payload is
        local static content, never visitor input.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(reviewsSchema()) }}
      />
      <FindUs />
    </>
  );
}
