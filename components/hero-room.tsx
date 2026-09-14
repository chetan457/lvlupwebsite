import { liveStations } from '@/content/stations';

/**
 * The room, built rather than photographed.
 *
 * A wall pinned by its near edge and swung away from the camera, the floor
 * folded down from its base so the corner is a real corner, and one screen per
 * bay we actually sell. Pure CSS 3D — no WebGL, no canvas, no image, no
 * request. Styles live in globals.css under `.hero-room`.
 *
 * The object is a fact, which is the point. Five screens because there are five
 * bays; the lit one is The Recliner, the bay people book a week ahead. That is
 * what a stock photograph of somebody else's lounge could never do.
 *
 * Decorative: every fact it encodes is stated in words in the copy beside it.
 */
export function HeroRoom({ open }: { open: boolean }) {
  // one screen per live bay, so the render cannot drift from the rate card
  const bays = liveStations.length;
  const litIndex = bays - 1;

  return (
    <div className="hero-room" data-open={open ? 'true' : 'false'} aria-hidden="true">
      <div className="stage">
        <div className="room">
          <div className="wall">
            <div className="floor">
              <div className="pool" style={{ left: '2540px', top: '30px' }} />
            </div>
            <div className="backwall" />

            {Array.from({ length: bays }, (_, i) => (
              <div
                key={i}
                className={`bay${i === litIndex ? ' bay--lit' : ''}`}
                style={{ left: `${180 + i * 410}px` }}
              >
                <div className="screen" />
                <div className="bay__mount" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="stage__fade" />
    </div>
  );
}
