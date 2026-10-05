import type { ReactNode } from 'react';
import { Container } from '../layout/Container';
import './PageHeader.scss';

type PageHeaderProps = {
  eyebrow?: string | null;
  title: string;
  intro?: string | null;
  align?: 'left' | 'center';
  children?: ReactNode;
};

/** Cabecera estándar de página interior: antetítulo, título, entradilla y acciones. */
export function PageHeader({ eyebrow, title, intro, align = 'left', children }: PageHeaderProps) {
  return (
    <header className={`page-header page-header--${align}`}>
      <Container>
        {eyebrow && <p className="page-header__eyebrow">{eyebrow}</p>}
        <h1 className="page-header__title">{title}</h1>
        {intro && <p className="page-header__intro">{intro}</p>}
        {children && <div className="page-header__extra">{children}</div>}
      </Container>
    </header>
  );
}
