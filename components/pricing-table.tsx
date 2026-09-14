import { bayRates } from '@/content/pricing';
import { Scroller } from '@/components/ui/section';

/**
 * Indian digit grouping (1,20,000 rather than 120,000) — the rate card is read
 * by people in Pune, so it should group the way they group.
 */
const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export function rupees(amount: number): string {
  return `₹${inr.format(amount)}`;
}

const cell = 'px-4 py-4 text-right font-mono text-[0.95rem] tabular-nums text-paper';
const head =
  'px-4 py-3 text-right font-mono text-[0.7rem] font-medium uppercase tracking-[0.16em] text-dim';

export function PricingTable() {
  return (
    <Scroller label="Rate card" className="rounded-card border border-edge bg-surface">
      {/* min-width forces the scroll into this box instead of the page at 320px */}
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <caption className="border-b border-edge px-4 py-4 text-left text-[0.85rem] text-dim">
          Placeholder rates, per hour, per bay. A dash in the off-peak column means
          that bay is not sold at the off-peak rate. Replace from the Pricing tab
          before launch.
        </caption>
        <thead>
          <tr className="border-b border-edge-hi">
            <th scope="col" className={`${head} text-left`}>
              Bay
            </th>
            <th scope="col" className={`${head} text-left`}>
              Seats
            </th>
            <th scope="col" className={head}>
              Weekday
            </th>
            <th scope="col" className={head}>
              Weekend
            </th>
            <th scope="col" className={head}>
              Off-peak
            </th>
          </tr>
        </thead>
        <tbody>
          {bayRates.map((row) => (
            <tr key={row.station} className="border-b border-edge last:border-b-0">
              <th
                scope="row"
                className="px-4 py-4 text-left text-[0.95rem] font-medium text-paper"
              >
                {row.station}
              </th>
              <td className="px-4 py-4 text-left font-mono text-[0.9rem] tabular-nums text-dim">
                {row.players}
              </td>
              <td className={cell}>{rupees(row.weekday)}</td>
              <td className={cell}>{rupees(row.weekend)}</td>
              <td className={`${cell} ${row.offPeak === null ? 'text-dim' : 'text-accent'}`}>
                {row.offPeak === null ? (
                  <>
                    <span aria-hidden="true">—</span>
                    <span className="sr-only">Not sold at the off-peak rate</span>
                  </>
                ) : (
                  rupees(row.offPeak)
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Scroller>
  );
}
