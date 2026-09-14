import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/**
 * The site has exactly three button weights. Anything that needs a fourth
 * probably needs rethinking instead.
 */
type Variant = 'primary' | 'ghost' | 'quiet';
type Size = 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-medium tracking-[-0.01em] ' +
  'transition-[transform,background-color,border-color] duration-250 ease-[cubic-bezier(0.16,1,0.3,1)] ' +
  'active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-lamp';

const variants: Record<Variant, string> = {
  primary:
    'bg-lamp text-lamp-ink font-semibold shadow-[inset_0_1px_0_rgb(255_255_255/0.22)] hover:bg-lamp-hi',
  ghost: 'border border-edge-hi text-paper hover:border-paper',
  quiet: 'text-dim hover:text-paper',
};

const sizes: Record<Size, string> = {
  // 44px min height keeps every control a comfortable tap target
  md: 'min-h-11 px-[1.15rem] py-3 text-[0.92rem]',
  lg: 'min-h-12 px-5 py-3 text-base',
};

export function buttonClass(variant: Variant = 'primary', size: Size = 'md', extra = '') {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(' ');
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  /** Set for links leaving the site; adds the safe rel and a new tab. */
  external?: boolean;
} & Omit<ComponentProps<'a'>, 'href' | 'className' | 'children'>;

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  external = false,
  children,
  ...rest
}: ButtonLinkProps) {
  const classes = buttonClass(variant, size, className);

  if (external || href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        className={classes}
        {...(href.startsWith('http')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
