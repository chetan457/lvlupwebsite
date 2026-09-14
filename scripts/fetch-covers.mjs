/**
 * Downloads vertical cover art for the games in content/games.ts.
 *
 *   node scripts/fetch-covers.mjs
 *
 * Source is Steam, which needs no API key:
 *   1. steamcommunity.com/actions/SearchApps/<title>  ->  appid
 *   2. .../store_item_assets/steam/apps/<appid>/library_600x900.jpg  ->  the box art
 *
 * That second asset is the vertical library capsule — the actual portrait cover,
 * not the landscape store banner, which is the shape our cases want.
 *
 * Covers are DOWNLOADED to public/games/ rather than hot-linked: a third-party
 * image host is a third-party request on every page load, and pointing at
 * someone else's CDN means the site breaks when they reorganise it.
 *
 * PlayStation exclusives are not on Steam and will not match. That is fine —
 * anything this cannot find keeps the generated case in game-case.tsx, so the
 * rack is complete either way.
 *
 * NOTE ON RIGHTS: cover art belongs to its publisher. Displaying it to list a
 * library you actually stock is ordinary practice for a venue, but it is the
 * owner's call, not this script's. Nothing runs unless you run it.
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const UA = 'Mozilla/5.0 (compatible; LvlUp site build)';
const OUT_DIR = join(process.cwd(), 'public', 'games');
const MANIFEST = join(process.cwd(), 'content', 'game-covers.ts');
const CDN = 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps';

/** Titles come from the content file, so it stays the single source. */
async function readGames() {
  const src = await readFile(join(process.cwd(), 'content', 'games.ts'), 'utf8');
  const games = [];
  const re = /slug:\s*'([^']+)'[^}]*?title:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    games.push({ slug: m[1], title: m[2].replace(/\\'/g, "'") });
  }
  return games;
}

const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]/g, '');

/**
 * Titles Steam's search will not return, with the appid supplied by hand.
 * Rocket League is delisted from search — the store page and the art are both
 * still there, the search index just will not surface it.
 */
const OVERRIDES = {
  'rocket-league': 252950,
};

/**
 * Games Steam cannot cover, with their PlayStation Store product id.
 *
 * Gran Turismo 7 is a PlayStation exclusive and will never be on Steam. EA FC
 * and F1 are on Steam but publish no vertical capsule there. The PS Store is
 * arguably the better source for a PS5 lounge anyway — it is the art on the
 * console these are actually played on.
 *
 * Ids are pinned rather than searched: the PS Store renders its results in the
 * browser, so there is nothing to scrape server-side, and a wrong guess would
 * silently ship the wrong cover. Find a new one by opening the store page for
 * the game and copying the id out of the URL.
 */
const PS_PRODUCTS = {
  'gran-turismo-7': 'UP9000-PPSA01317_00-GT7STD0000000PS5',
  'ea-sports-fc-26': 'UP0006-PPSA27360_00-26STANDARDBUNDLE',
  'f1-25': 'UP0006-PPSA24662_00-F12025PS5GAME000',
};

/**
 * PS Store art comes as 16:9 or 1:1, never the 2:3 Steam uses. The square
 * PORTRAIT_BANNER is the closest, and it crops to a portrait case cleanly
 * because key art centres its logo and subjects.
 */
async function playstationCover(productId) {
  const res = await fetch(`https://store.playstation.com/en-us/product/${productId}`, {
    headers: { 'User-Agent': UA },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`PS Store ${res.status}`);
  const html = await res.text();

  for (const role of ['PORTRAIT_BANNER', 'GAMEHUB_COVER_ART', 'MASTER']) {
    for (const m of html.matchAll(new RegExp(`"role"\\s*:\\s*"${role}"`, 'g'))) {
      const window = html.slice(Math.max(0, m.index - 360), m.index + 360);
      const url = window.match(/"url"\s*:\s*"(https:\/\/image\.api\.playstation\.com\/vulcan[^"]+)"/);
      if (url) {
        const img = await fetch(`${url[1]}?w=900`, { headers: { 'User-Agent': UA } });
        if (img.ok) return { buffer: Buffer.from(await img.arrayBuffer()), role };
      }
    }
  }
  throw new Error('no usable art role on the PS Store page');
}

/** Store what we display: 3:4, centre-cropped, so no byte is downloaded to be cropped away. */
async function toCase(buffer) {
  try {
    const sharp = (await import('sharp')).default;
    return await sharp(buffer)
      .resize(600, 800, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 82 })
      .toBuffer();
  } catch {
    return buffer;
  }
}

/**
 * Steam's search is fuzzy — "F1 25" surfaces older F1 titles, and a franchise
 * name pulls in DLC. Take an exact normalised match, then a prefix match, and
 * only then give up rather than shipping the wrong cover.
 */
function pickMatch(results, title) {
  const want = norm(title);
  return (
    results.find((r) => norm(r.name) === want) ??
    results.find((r) => norm(r.name).startsWith(want)) ??
    results.find((r) => want.startsWith(norm(r.name)) && norm(r.name).length > 6) ??
    null
  );
}

async function blurFrom(buffer) {
  try {
    const sharp = (await import('sharp')).default;
    const tiny = await sharp(buffer).resize(12, 18, { fit: 'fill' }).jpeg({ quality: 40 }).toBuffer();
    return `data:image/jpeg;base64,${tiny.toString('base64')}`;
  } catch {
    return null; // sharp is optional; without it the cover just appears when it loads
  }
}

const games = await readGames();
if (!games.length) {
  console.error('Could not read any games out of content/games.ts — has its shape changed?');
  process.exit(1);
}

await mkdir(OUT_DIR, { recursive: true });

const found = [];
const missed = [];

for (const game of games) {
  try {
    const override = OVERRIDES[game.slug];
    const match = override
      ? { appid: override, name: `${game.title} (pinned appid)` }
      : await (async () => {
          const search = await fetch(
            `https://steamcommunity.com/actions/SearchApps/${encodeURIComponent(game.title)}`,
            { headers: { 'User-Agent': UA } },
          );
          if (!search.ok) throw new Error(`search ${search.status}`);
          const hit = pickMatch(await search.json(), game.title);
          if (!hit) throw new Error('no confident match on Steam');
          return hit;
        })();

    const img = await fetch(`${CDN}/${match.appid}/library_600x900.jpg`, {
      headers: { 'User-Agent': UA },
    });
    if (!img.ok) throw new Error(`no vertical capsule (${img.status})`);

    const buffer = Buffer.from(await img.arrayBuffer());
    if (buffer.length < 4000) throw new Error('capsule too small to be real art');

    await writeFile(join(OUT_DIR, `${game.slug}.jpg`), buffer);
    found.push({ slug: game.slug, blur: await blurFrom(buffer) });
    console.log(`  ok    ${game.title}  ->  ${match.name}  (${Math.round(buffer.length / 1024)}KB)`);
  } catch (steamErr) {
    // Steam could not serve it; fall back to the PlayStation Store where pinned
    const productId = PS_PRODUCTS[game.slug];
    if (!productId) {
      missed.push(`${game.title} — ${steamErr.message}`);
      console.log(`  skip  ${game.title}  ->  ${steamErr.message}`);
    } else {
      try {
        const { buffer, role } = await playstationCover(productId);
        const cropped = await toCase(buffer);
        await writeFile(join(OUT_DIR, `${game.slug}.jpg`), cropped);
        found.push({ slug: game.slug, blur: await blurFrom(cropped) });
        console.log(
          `  ok    ${game.title}  ->  PlayStation Store ${role}  (${Math.round(cropped.length / 1024)}KB)`,
        );
      } catch (psErr) {
        missed.push(`${game.title} — Steam: ${steamErr.message}; PS: ${psErr.message}`);
        console.log(`  skip  ${game.title}  ->  ${psErr.message}`);
      }
    }
  }

  await new Promise((r) => setTimeout(r, 300));
}

const entries = found
  .map(
    (f) => `  '${f.slug}': {
    src: '/games/${f.slug}.jpg',
    blur:${f.blur ? `\n      '${f.blur}',` : ' null,'}
  },`,
  )
  .join('\n');

await writeFile(
  MANIFEST,
  `/**
 * GENERATED by scripts/fetch-covers.mjs — do not edit by hand.
 *
 * Cover art belongs to the respective publishers. A game missing from this map
 * falls back to the generated case in components/game-case.tsx, so the rack
 * never has a hole in it.
 */

export type Cover = { src: string; blur: string | null };

export const covers: Record<string, Cover> = {
${entries}
};
`,
  'utf8',
);

console.log(`\n${found.length} of ${games.length} covers written to public/games/`);
if (missed.length) {
  console.log(`${missed.length} keeping the generated case:`);
  missed.forEach((m) => console.log(`  · ${m}`));
}
