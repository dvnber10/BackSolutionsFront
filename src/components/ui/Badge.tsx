import type { ReactNode } from 'react';
import './Badge.scss';

type Tone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
  className?: string;
};

/** Etiqueta corta de estado o categoría. */
export function Badge({ children, tone = 'neutral', className }: BadgeProps) {
  return (
    <span className={`badge badge--${tone}${className ? ` ${className}` : ''}`}>{children}</span>
  );
}
