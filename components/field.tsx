import type { ReactNode } from 'react';

/**
 * One labelled control, wired once.
 *
 * Label above, helper text under it, error under the control with role="alert".
 * The control itself comes in as a function so the ids, the aria wiring and the
 * class string are assembled here and cannot drift field by field.
 */

/** Border colour is left off deliberately — Field adds it per state. */
export const controlClass =
  'w-full min-h-11 rounded-[10px] border bg-surface px-3.5 py-3 text-[0.95rem] text-paper ' +
  'placeholder:text-dim transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ' +
  'hover:border-paper/30 focus:border-lamp';

export type FieldControlProps = {
  id: string;
  name: string;
  className: string;
  required: boolean;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
};

export function Field({
  name,
  label,
  hint,
  error,
  required = false,
  id = name,
  controlClassName = '',
  className = '',
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  id?: string;
  /** Extra classes on the control — font-mono for the numeric ones. */
  controlClassName?: string;
  /** Extra classes on the wrapper, for grid placement. */
  className?: string;
  children: (props: FieldControlProps) => ReactNode;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ');

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label htmlFor={id} className="flex items-baseline gap-2 text-[0.85rem] font-medium text-paper">
        {label}
        {required ? null : (
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-dim">
            optional
          </span>
        )}
      </label>

      {hint ? (
        <p id={hintId} className="text-[0.8rem] leading-snug text-dim">
          {hint}
        </p>
      ) : null}

      {children({
        id,
        name,
        required,
        className: [controlClass, error ? 'border-lamp' : 'border-edge-hi', controlClassName]
          .filter(Boolean)
          .join(' '),
        ...(describedBy ? { 'aria-describedby': describedBy } : {}),
        ...(error ? { 'aria-invalid': true as const } : {}),
      })}

      {error ? (
        <p id={errorId} role="alert" className="flex items-start gap-2 text-[0.8rem] text-accent">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
            className="mt-px h-4 w-4 shrink-0"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5" />
            <path d="M12 16.2v.3" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}
