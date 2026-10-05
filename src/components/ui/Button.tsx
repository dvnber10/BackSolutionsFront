import type { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import './Button.scss';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
  /** Enlace interno. Renderiza <Link>. */
  to?: string;
  /** Enlace externo. Renderiza <a>. */
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  onClick?: MouseEventHandler;
  title?: string;
  target?: string;
  rel?: string;
  'aria-label'?: string;
};

/**
 * Botón y enlace con apariencia de botón, en un solo componente. Un enlace tiene que
 * seguir siendo un enlace (navegable, con el botón central del mouse), así que según
 * las props se renderiza <Link>, <a> o <button>.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  to,
  href,
  type = 'button',
  disabled = false,
  loading = false,
  onClick,
  title,
  target,
  rel,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, block ? 'btn--block' : '', className]
    .filter(Boolean)
    .join(' ');
  const isBusy = loading || disabled;
  const content = (
    <>
      {loading && <Loader2 className="btn__spinner" aria-hidden="true" />}
      <span className="btn__label">{children}</span>
    </>
  );

  if (to) {
    return (
      <Link
        className={classes}
        to={to}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
        aria-busy={loading || undefined}
        aria-disabled={isBusy || undefined}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        onClick={onClick}
        title={title}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type={type}
      disabled={isBusy}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
    >
      {content}
    </button>
  );
}
