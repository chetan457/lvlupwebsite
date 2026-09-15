'use client';

import { useActionState, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { submitBooking, type BookingState } from '@/app/contact/actions';
import { BookButton } from '@/components/book-button';
import { Field, controlClass } from '@/components/field';
import { ButtonLink, buttonClass } from '@/components/ui/button';
import { site } from '@/content/site';
import { liveStations } from '@/content/stations';

/**
 * The form is the slow lane and says so. WhatsApp sits above it because a
 * message gets answered in minutes and a form request waits for whoever next
 * checks the counter laptop.
 */

const initialState: BookingState = { status: 'idle', message: '' };

type Values = {
  name: string;
  phone: string;
  date: string;
  time: string;
  bay: string;
  players: string;
  duration: string;
  notes: string;
};

const emptyValues: Values = {
  name: '',
  phone: '',
  date: '',
  time: '',
  bay: '',
  players: '2',
  duration: '1',
  notes: '',
};

const durations = [1, 2, 3, 4, 5, 6];

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dim"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={buttonClass(
        'primary',
        'lg',
        'w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70',
      )}
    >
      {pending ? 'Sending…' : 'Send booking request'}
    </button>
  );
}

export function BookingForm() {
  const [state, formAction] = useActionState(submitBooking, initialState);
  const [values, setValues] = useState<Values>(emptyValues);
  const [today, setToday] = useState('');

  // Read after mount rather than during render: the server and the visitor's
  // browser can sit in different timezones, and a mismatched min= would fail
  // hydration. The action re-checks the date anyway.
  useEffect(() => {
    setToday(new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date()));
  }, []);

  const errors = state.fieldErrors ?? {};
  const set = (key: keyof Values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  return (
    <div className="flex flex-col gap-7">
      <div className="glass flex flex-col gap-4 rounded-card p-5 sm:p-6">
        <p className="eyebrow">Quickest reply</p>
        <div className="flex flex-wrap items-center gap-3">
          <BookButton size="lg" />
          <ButtonLink href={`tel:${site.phone}`} variant="ghost" size="lg">
            Call {site.phoneDisplay}
          </ButtonLink>
        </div>
        <p className="max-w-[52ch] text-[0.9rem] text-dim">
          A message gets answered while someone is at the counter. The form goes to the same people
          and books the same bays; it only waits for whoever next checks the laptop. If you are not
          in a hurry, it is the easier one to send.
        </p>
      </div>

      <div aria-live="polite">
        {state.status === 'ok' ? (
          <div className="rounded-card border border-lamp/40 bg-surface p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0 text-accent"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m8.5 12.2 2.4 2.4 4.6-5" />
              </svg>
              <div className="flex flex-col gap-3">
                <h2 className="text-[1.15rem]">Request in. Nothing is held yet.</h2>
                <p className="font-mono text-[0.85rem] text-paper">{state.message}</p>
                <p className="max-w-[48ch] text-[0.9rem] text-dim">
                  We reply on WhatsApp to confirm the bay, or to offer the nearest slot we have.
                  That happens as soon as someone is at the counter, and when we next open if you
                  sent this after closing. Pay when you arrive.
                </p>
                <div className="pt-1">
                  <BookButton size="lg">Follow up on WhatsApp</BookButton>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {state.status === 'error' ? (
          <div
            role="alert"
            className="rounded-card border border-lamp/40 bg-surface px-5 py-4 text-[0.9rem]"
          >
            <p className="text-paper">{state.message}</p>
            {Object.keys(errors).length > 0 ? (
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-5 text-dim">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>
                    <a href={`#${field}`} className="underline underline-offset-4 hover:text-paper">
                      {message}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      {state.status === 'ok' ? null : (
        <form action={formAction} className="relative grid gap-5 sm:grid-cols-2">
          {/* Honeypot: off-screen rather than display:none, which the cruder
              scrapers know to skip. Hidden from assistive tech and untabbable. */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-px w-px overflow-hidden">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
          </div>

          <Field name="name" label="Name" required error={errors.name} className="sm:col-span-2">
            {(props) => (
              <input
                {...props}
                type="text"
                autoComplete="name"
                maxLength={80}
                value={values.name}
                onChange={(event) => set('name')(event.target.value)}
              />
            )}
          </Field>

          <Field
            name="phone"
            label="Mobile"
            required
            hint="We reply here on WhatsApp."
            error={errors.phone}
            controlClassName="font-mono"
          >
            {(props) => (
              <input
                {...props}
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="84016 65488"
                value={values.phone}
                onChange={(event) => set('phone')(event.target.value)}
              />
            )}
          </Field>

          <Field name="date" label="Date" required error={errors.date} controlClassName="font-mono">
            {(props) => (
              <input
                {...props}
                type="date"
                min={today || undefined}
                value={values.date}
                onChange={(event) => set('date')(event.target.value)}
              />
            )}
          </Field>

          <Field
            name="time"
            label="Start time"
            required
            error={errors.time}
            controlClassName="font-mono"
          >
            {(props) => (
              <input
                {...props}
                type="time"
                value={values.time}
                onChange={(event) => set('time')(event.target.value)}
              />
            )}
          </Field>

          <Field
            name="bay"
            label="Bay"
            hint="Leave it on whichever is free and we will give you the best bay open at that time."
            error={errors.bay}
          >
            {(props) => (
              <div className="relative">
                <select
                  {...props}
                  className={`${props.className} appearance-none pr-10`}
                  value={values.bay}
                  onChange={(event) => set('bay')(event.target.value)}
                >
                  <option value="">Whichever is free</option>
                  {liveStations.map((station) => (
                    <option key={station.id} value={station.id}>
                      {station.name}
                      {station.rate === null ? '' : ` — ₹${station.rate}/hr`}
                    </option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            )}
          </Field>

          <Field
            name="players"
            label="Players"
            required
            hint={`Up to ${site.seats} in the room.`}
            error={errors.players}
            controlClassName="font-mono"
          >
            {(props) => (
              <input
                {...props}
                type="number"
                inputMode="numeric"
                min={1}
                max={10}
                step={1}
                value={values.players}
                onChange={(event) => set('players')(event.target.value)}
              />
            )}
          </Field>

          <Field name="duration" label="Hours" required error={errors.duration}>
            {(props) => (
              <div className="relative">
                <select
                  {...props}
                  className={`${props.className} appearance-none pr-10 font-mono`}
                  value={values.duration}
                  onChange={(event) => set('duration')(event.target.value)}
                >
                  {durations.map((hours) => (
                    <option key={hours} value={hours}>
                      {hours} {hours === 1 ? 'hour' : 'hours'}
                    </option>
                  ))}
                </select>
                <ChevronIcon />
              </div>
            )}
          </Field>

          <Field
            name="notes"
            label="Anything else"
            hint="A birthday, a game you want installed, someone arriving late."
            error={errors.notes}
            className="sm:col-span-2"
          >
            {(props) => (
              <textarea
                {...props}
                rows={3}
                maxLength={500}
                className={`${props.className} min-h-24 resize-y`}
                value={values.notes}
                onChange={(event) => set('notes')(event.target.value)}
              />
            )}
          </Field>

          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center">
            <SubmitButton />
            <p className="text-[0.8rem] text-dim">
              No payment now. Nothing is held until we reply.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
