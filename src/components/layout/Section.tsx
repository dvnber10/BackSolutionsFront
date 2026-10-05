import type { ReactNode } from 'react';
import { Container } from './Container';
import './Section.scss';

type SectionProps = {
  children: ReactNode;
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  align?: 'left' | 'center';
  tone?: 'default' | 'muted';
  /** Acciones a la derecha del encabezado (ej: "ver todo"). */
  action?: ReactNode;
  className?: string;
};

/** Bloque vertical del sitio con encabezado opcional, para mantener el ritmo entre secciones. */
export function Section({
  children,
  id,
  eyebrow,
  title,
  intro,
  align = 'left',
  tone = 'default',
  action,
  className,
}: SectionProps) {
  const hasHead = Boolean(eyebrow || title || intro || action);

  return (
    <section
      id={id}
      className={[
        'section',
        tone === 'muted' ? 'section--muted' : '',
        align === 'center' ? 'section--center' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Container>
        {hasHead && (
          <div className="section__head">
            <div className="section__head-text">
              {eyebrow && <p className="section__eyebrow">{eyebrow}</p>}
              {title && <h2 className="section__title">{title}</h2>}
              {intro && <p className="section__intro">{intro}</p>}
            </div>
            {action && <div className="section__action">{action}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
