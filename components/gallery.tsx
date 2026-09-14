import Image from 'next/image';

import { Band, BandHead } from '@/components/ui/section';
import { photoSrc, photos, type PhotoKey } from '@/content/images';

/**
 * Six frames on a twelve-column grid, deliberately unequal: a wide-and-narrow
 * pair, then the reverse, then a narrow-and-wide. Row heights shrink down the
 * page so the eye lands on the room first and the detail shots last.
 *
 * `crop` matches the slot's shape so Unsplash returns the pixels we display
 * rather than a square we then chop with object-fit.
 */
type Tile = {
  key: PhotoKey;
  span: string;
  height: string;
  crop: [number, number];
  sizes: string;
};

const tiles: Tile[] = [
  {
    key: 'arcade',
    span: 'lg:col-span-7',
    height: 'h-[clamp(14rem,30vw,22rem)]',
    crop: [1320, 840],
    sizes: '(min-width: 1024px) 660px, (min-width: 768px) 46vw, 92vw',
  },
  {
    key: 'player',
    span: 'lg:col-span-5',
    height: 'h-[clamp(14rem,30vw,22rem)]',
    crop: [940, 840],
    sizes: '(min-width: 1024px) 470px, (min-width: 768px) 46vw, 92vw',
  },
  {
    key: 'group',
    span: 'lg:col-span-5',
    height: 'h-[clamp(12rem,24vw,17rem)]',
    crop: [940, 640],
    sizes: '(min-width: 1024px) 470px, (min-width: 768px) 46vw, 92vw',
  },
  {
    key: 'couchCoop',
    span: 'lg:col-span-7',
    height: 'h-[clamp(12rem,24vw,17rem)]',
    crop: [1320, 640],
    sizes: '(min-width: 1024px) 660px, (min-width: 768px) 46vw, 92vw',
  },
  {
    key: 'controller',
    span: 'lg:col-span-4',
    height: 'h-[clamp(11rem,20vw,15rem)]',
    crop: [760, 560],
    sizes: '(min-width: 1024px) 375px, (min-width: 768px) 46vw, 92vw',
  },
  {
    key: 'console',
    span: 'lg:col-span-8',
    height: 'h-[clamp(11rem,20vw,15rem)]',
    crop: [1520, 560],
    sizes: '(min-width: 1024px) 760px, (min-width: 768px) 46vw, 92vw',
  },
];

export function Gallery() {
  return (
    <Band id="gallery">
      <BandHead eyebrow="04 / The room" title="What it looks like on a Tuesday">
        Low light, big screens, seats you can sink into. No stage lighting, no crowd shot with
        everyone cheering at once.
      </BandHead>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12 lg:gap-4">
        {tiles.map((tile) => {
          const photo = photos[tile.key];
          return (
            <figure
              key={tile.key}
              className={`${tile.span} ${tile.height} relative overflow-hidden rounded-card border border-edge bg-surface`}
            >
              <Image
                src={photoSrc(photo, tile.crop[0], tile.crop[1])}
                alt={photo.alt}
                width={tile.crop[0]}
                height={tile.crop[1]}
                sizes={tile.sizes}
                loading="lazy"
                placeholder="blur"
                blurDataURL={photo.blur}
                className="h-full w-full object-cover"
              />
            </figure>
          );
        })}
      </div>

      <p className="mt-5 max-w-[52ch] font-mono text-[0.72rem] leading-relaxed text-dim">
        These are stand-in photographs. Every frame above is a stock image cropped to the slot one
        of my own shots will fill, and all of them get replaced before launch.
      </p>
    </Band>
  );
}
