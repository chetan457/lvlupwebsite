import { Band, BandHead } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { payment, rates, tournament } from '@/content/pricing';

const inr = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

/**
 * One grid, 1px gaps, the edge colour showing through. Four separate cards
 * would float; this reads as a single rate card, which is what people
 * screenshot and send to a friend.
 */
export function RatesStrip() {
  return (
    <Band id="rates">
      {/* The figures in the heading and the standfirst are kept by hand; they track `rates` below. */}
      <BandHead eyebrow="03 / Rates" title="₹90 to ₹250 an hour, per bay">
        Bring a friend and the rate does not move; the figure is for the bay. If you mostly come in
        the evening, a pass takes <span className="font-mono">₹120</span> down to{' '}
        <span className="font-mono">₹100</span>.
      </BandHead>

      <div className="grid gap-px overflow-hidden rounded-card border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-4">
        {rates.map((rate) => (
          <div
            key={rate.id}
            className={`flex flex-col gap-3 p-5 sm:p-6 ${rate.highlight ? 'bg-surface' : 'bg-room'}`}
          >
            <p className="eyebrow">{rate.label}</p>
            <p
              className={`font-mono text-[clamp(1.85rem,4vw,2.5rem)] leading-none tracking-[-0.03em] ${
                rate.highlight ? 'text-accent' : 'text-paper'
              }`}
            >
              {inr(rate.amount)}
              {rate.unit ? <span className="text-[0.45em] text-dim">{rate.unit}</span> : null}
            </p>
            <p className="text-[0.85rem] leading-snug text-dim">{rate.when}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-card border border-edge p-4">
        <p className="eyebrow">{tournament.when}</p>
        <p className="max-w-[52ch] text-[0.88rem] text-dim">
          {tournament.format}, {inr(tournament.entry)} to enter. {tournament.prize} to the winner.
          Message us and we will put your name down.
        </p>
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <p className="max-w-[44ch] text-[0.85rem] text-dim">{payment.methods}</p>
        <ButtonLink href="/pricing" variant="ghost">
          See passes and the recliner rate
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </ButtonLink>
      </div>
    </Band>
  );
}
