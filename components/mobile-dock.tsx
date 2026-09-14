import { BookButton } from '@/components/book-button';
import { cheapestHour } from '@/content/pricing';

export function MobileDock() {
  return (
    <div
      className="glass fixed inset-x-0 bottom-0 z-50 rounded-none border-x-0 border-b-0 pt-3 lg:hidden"
      // the home indicator on iOS sits inside the bar otherwise
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 0.75rem)' }}
    >
      <div className="shell flex items-center justify-between gap-4">
        <p className="flex flex-col gap-1">
          <span className="eyebrow leading-none">From</span>
          <span className="font-mono text-[1.05rem] leading-none text-paper">
            &#8377;{cheapestHour}
            <span className="text-[0.75rem] text-dim"> /hr</span>
          </span>
        </p>
        <BookButton>Book a bay</BookButton>
      </div>
    </div>
  );
}
