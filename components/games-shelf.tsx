import { GameCase } from '@/components/game-case';
import { GamesCorridor } from '@/components/games-corridor';
import { Band, BandHead, Scroller } from '@/components/ui/section';
import { ButtonLink } from '@/components/ui/button';
import { games, platform } from '@/content/games';

/**
 * A pure CSS rack: scroll-snap, no JavaScript, no drag handler. Touch flicks it,
 * a trackpad flicks it, and the Scroller's tabIndex lets arrow keys walk it —
 * all without the page ever scrolling sideways.
 *
 * The cases are deliberately not box art — we hold no rights to any. Each one is
 * built from the title over a mark picked deterministically from the slug, so
 * the rack is legible at a glance without borrowing a publisher's artwork.
 */
export function GamesShelf() {
  return (
    <Band id="games">
      <BandHead eyebrow="02 / Games" title={`${games.length} discs, all of them installed`}>
        FC 26, Tekken 8, Gran Turismo 7, Elden Ring and the rest of the rack, all of them on{' '}
        {platform}. Player counts sit on every case, so you can see what suits a group.
      </BandHead>

      <Scroller label="Games" className="lg:hidden -mx-[clamp(1.15rem,4vw,3rem)] snap-x snap-proximity scroll-px-[clamp(1.15rem,4vw,3rem)]">
        <ul className="flex gap-4 px-[clamp(1.15rem,4vw,3rem)] pb-3">
          {games.map((game, index) => (
            <li key={game.slug} className="group w-[9.75rem] shrink-0 snap-start sm:w-[11.25rem]">
              <GameCase
                game={game}
                index={index}
                className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1"
              />

              <p className="mt-2.5 text-[0.8rem] leading-snug text-dim">{game.note}</p>
            </li>
          ))}
        </ul>
      </Scroller>

      <GamesCorridor />

      <ul className="hidden sr-only lg:block">
        {games.map((game) => (
          <li key={game.slug}>{`${game.title} — ${game.players} ${game.players === '1' ? 'player' : 'players'}`}</li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
        <ButtonLink href="/contact" variant="ghost">
          Ask for a title
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
        <p className="max-w-[42ch] text-[0.85rem] text-dim">
          Tell us before you come and anything that is not on the rack is downloaded and ready for
          your slot.
        </p>
      </div>
    </Band>
  );
}
