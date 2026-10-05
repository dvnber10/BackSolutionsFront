import type { ReactNode } from 'react';
import './AdminPage.scss';

type AdminPageProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/** Cabecera estándar de una pantalla del panel, con acciones a la derecha. */
export function AdminPage({ title, description, actions, children }: AdminPageProps) {
  return (
    <div className="admin-page">
      <header className="admin-page__head">
        <div className="admin-page__heading">
          <h1 className="admin-page__title">{title}</h1>
          {description && <p className="admin-page__desc">{description}</p>}
        </div>
        {actions && <div className="admin-page__actions">{actions}</div>}
      </header>
      {children}
    </div>
  );
}
