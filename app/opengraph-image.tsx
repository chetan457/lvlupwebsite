import { ImageResponse } from 'next/og';

import { site } from '@/content/site';
import { cheapestHour } from '@/content/pricing';

export const alt = `${site.name} — ${site.tagline} in ${site.address.locality}, ${site.address.city}. From ₹${cheapestHour} an hour.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * The WhatsApp forward card. It fetches nothing and loads no font — the bundled
 * Geist that next/og ships with is the only typeface here — so the route cannot
 * fail or stall while a link preview is being generated. Everything is sized to
 * survive being shrunk to a 200px chat thumbnail: one wordmark, one line of
 * plain English, one price.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#050608',
          padding: '68px 76px',
          position: 'relative',
        }}
      >
        {/* the lamp, sitting off the right edge the way it does on the site */}
        <div
          style={{
            position: 'absolute',
            top: -280,
            right: -240,
            width: 900,
            height: 900,
            backgroundImage:
              'radial-gradient(circle, rgba(200,118,58,0.30) 0%, rgba(200,118,58,0.10) 42%, rgba(200,118,58,0) 68%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#a7b0bb',
          }}
        >
          {site.address.locality} · {site.address.city}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: 170,
              letterSpacing: '-0.045em',
              lineHeight: 1,
              color: '#f5f7fa',
            }}
          >
            Lvl<span style={{ color: '#00a8ff' }}>Up</span>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: 26,
              fontSize: 50,
              letterSpacing: '-0.02em',
              color: '#f5f7fa',
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(232,227,220,0.18)',
            paddingTop: 30,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontSize: 30, color: '#a7b0bb', marginRight: 14 }}>from</span>
            <span style={{ fontSize: 66, color: '#00a8ff', letterSpacing: '-0.03em' }}>
              ₹{cheapestHour}
            </span>
            <span style={{ fontSize: 34, color: '#a7b0bb', marginLeft: 6 }}>/hr</span>
          </div>
          <div style={{ display: 'flex', fontSize: 30, color: '#a7b0bb' }}>
            {site.bays} bays · {site.seats} seats
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
