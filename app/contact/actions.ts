'use server';

import { headers } from 'next/headers';

import { liveStations } from '@/content/stations';

/**
 * Booking requests.
 *
 * Validation is written by hand on purpose: seven fields and one honeypot do
 * not justify shipping a schema library to solve a problem this small, and the
 * rules below are the actual counter rules rather than a generic shape.
 */

export type BookingState = {
  status: 'idle' | 'ok' | 'error';
  message: string;
  fieldErrors?: Record<string, string>;
};

const MAX_NOTES = 500;
const MIN_PLAYERS = 1;
const MAX_PLAYERS = 10;
const MIN_HOURS = 1;
const MAX_HOURS = 6;

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

/**
 * Rate limit, deliberately crude: one Map, one fixed ten-minute window, keyed
 * by a coarse bucket of caller plus window index. It lives in process memory,
 * so it empties on every redeploy and is not shared between instances — it
 * only blunts a naive flood from one address. Move it to a durable store
 * (Redis, Upstash) the first time the form sees real traffic.
 */
const buckets = new Map<string, { window: number; count: number }>();

function overRateLimit(key: string, now: number): boolean {
  const window = Math.floor(now / RATE_WINDOW_MS);

  // drop last window's buckets so the map cannot grow without bound
  for (const [existing, hit] of buckets) {
    if (hit.window !== window) buckets.delete(existing);
  }

  const hit = buckets.get(key);
  if (!hit) {
    buckets.set(key, { window, count: 1 });
    return false;
  }
  hit.count += 1;
  return hit.count > RATE_MAX;
}

async function rateKey(): Promise<string> {
  const head = await headers();
  const forwarded = head.get('x-forwarded-for');
  const caller = forwarded?.split(',')[0]?.trim() || head.get('x-real-ip') || 'unknown';
  return `booking:${caller}`;
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Indian mobiles, typed the way people actually type them: spaces, dashes,
 * brackets, a +91, a 0, or none of the above. Ten digits opening 6–9 after
 * all that is the only thing worth insisting on.
 */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s\-().]/g, '');
  // Only strip a country code / trunk prefix when there is one to strip: a bare
  // 10-digit number may legitimately start with 91 (e.g. 9123456789).
  const local = digits.length > 10 ? digits.replace(/^(\+?91|0)/, '') : digits;
  return /^[6-9]\d{9}$/.test(local) ? local : null;
}

/** Today in the lounge's own timezone, so a server in another one cannot reject a valid date. */
function todayInIndia(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date());
}

function formatDate(iso: string): string {
  const parsed = new Date(`${iso}T00:00:00`);
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(parsed);
}

export async function submitBooking(
  _prevState: BookingState,
  formData: FormData,
): Promise<BookingState> {
  // Honeypot. A real person never sees this field, so anything in it is a bot.
  // Answered with the ordinary success shape rather than an error, because an
  // error tells a scripted submitter exactly which field gave it away.
  if (text(formData, 'company') !== '') {
    console.info('[booking] discarded: honeypot filled');
    return { status: 'ok', message: 'Got it. We will confirm on WhatsApp, usually within the hour we are open.' };
  }

  if (overRateLimit(await rateKey(), Date.now())) {
    return {
      status: 'error',
      message: `That is ${RATE_MAX} requests in ten minutes. Message us on WhatsApp instead — it is faster anyway.`,
    };
  }

  const name = text(formData, 'name');
  const phoneRaw = text(formData, 'phone');
  const date = text(formData, 'date');
  const time = text(formData, 'time');
  const bay = text(formData, 'bay');
  const playersRaw = text(formData, 'players');
  const durationRaw = text(formData, 'duration');
  const notes = text(formData, 'notes');

  const fieldErrors: Record<string, string> = {};

  if (name.length < 2 || name.length > 80) {
    fieldErrors.name = 'Tell us what to call you — at least 2 characters.';
  }

  const phone = normalisePhone(phoneRaw);
  if (!phone) {
    fieldErrors.phone = 'That is not a 10-digit Indian mobile. Check it and send again.';
  }

  const today = todayInIndia();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) {
    fieldErrors.date = 'Pick a date.';
  } else if (date < today) {
    fieldErrors.date = 'That date has passed. Pick today or later.';
  }

  // Not in the stated rules, but the form collects a time and a request without
  // one cannot be held against a bay.
  if (!/^\d{2}:\d{2}$/.test(time)) {
    fieldErrors.time = 'Pick a start time.';
  }

  // Blank means no preference; anything else has to be a bay we actually rent.
  if (bay !== '' && !liveStations.some((station) => station.id === bay)) {
    fieldErrors.bay = 'Choose one of the bays listed.';
  }

  const players = Number(playersRaw);
  if (!Number.isInteger(players) || players < MIN_PLAYERS || players > MAX_PLAYERS) {
    fieldErrors.players = `Give us a number between ${MIN_PLAYERS} and ${MAX_PLAYERS} — the room seats ${MAX_PLAYERS}.`;
  }

  const duration = Number(durationRaw);
  if (!Number.isInteger(duration) || duration < MIN_HOURS || duration > MAX_HOURS) {
    fieldErrors.duration = `Pick between ${MIN_HOURS} and ${MAX_HOURS} hours. Longer than that, message us.`;
  }

  if (notes.length > MAX_NOTES) {
    fieldErrors.notes = `Keep it under ${MAX_NOTES} characters — ${notes.length} right now.`;
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 'error',
      message: 'Nothing sent yet — the marked fields need another look.',
      fieldErrors,
    };
  }

  const payload = {
    name,
    phone,
    date,
    time,
    bay: bay || 'no preference',
    players,
    duration,
    notes,
    receivedAt: new Date().toISOString(),
  };

  // TODO: send this to the counter over email with Resend — `resend.emails.send`
  // from the `resend` package, keyed by RESEND_API_KEY, to site.email. Until
  // that key exists the request only reaches the server log, so the WhatsApp
  // route above the form is the one that actually books a bay today.
  console.info('[booking] request', payload);

  return {
    status: 'ok',
    // The number the visitor typed is never read back — a shoulder-surfed
    // confirmation panel should not hand out a phone number.
    message: `${formatDate(date)} at ${time}, ${duration} ${duration === 1 ? 'hour' : 'hours'}, ${players} ${players === 1 ? 'player' : 'players'}.`,
  };
}
