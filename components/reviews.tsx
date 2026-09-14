import { BookButton } from '@/components/book-button';
import { Band, BandHead } from '@/components/ui/section';
import { reviews } from '@/content/reviews';
import { site } from '@/content/site';

/** Filled to `count`, outlined after it, with one label for the whole run. */
function Stars({ count }: { count: number }) {
  return (
    <span role="img" aria-label={`${count} out of 5`} className="inline-flex gap-[3px]">
      {[1, 2, 3, 4, 5].map((position) => (
        <svg
          key={position}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={position <= count ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
          aria-hidden="true"
          className={position <= count ? 'text-accent' : 'text-dimmer'}
        >
          <path d="m12 3 2.75 5.7 6.25.9-4.5 4.4 1.06 6.2L12 17.3l-5.56 2.9L7.5 14 3 9.6l6.25-.9Z" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <Band id="reviews">
      <BandHead
        eyebrow="05 / Reviews"
        title={`${site.rating.value} from ${site.rating.count}, complaints included`}
      >
        Copied across from Google, unedited. The one about parking stays up, because it is true.
      </BandHead>

      <div className="grid gap-x-8 gap-y-10 md:grid-cols-3 lg:grid-cols-[1.15fr_1fr_1fr]">
        {reviews.map((review) => (
          <figure key={review.name} className="border-t border-edge-hi pt-5">
            <Stars count={review.stars} />
            <blockquote className="mt-4 text-[0.95rem] leading-relaxed text-paper">
              {review.text}
            </blockquote>
            <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[0.9rem]">{review.name}</span>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-dim">
                {review.source}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <BookButton>Book a bay</BookButton>
        <p className="max-w-[44ch] text-[0.85rem] text-dim">
          We did not choose which ones show. Pick a time and we will keep a bay for you.
        </p>
      </div>
    </Band>
  );
}
