import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Spinner } from './Spinner';
import './StateBlock.scss';

type StateBlockProps = {
  variant: 'loading' | 'error' | 'empty';
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: ReactNode;
};

/**
 * Estado no-feliz unificado: cargando, error y vacío. Tenerlo en un solo componente evita
 * que cada página invente su propio mensaje y su propio layout para lo mismo.
 */
export function StateBlock({ variant, title, message, onRetry, action }: StateBlockProps) {
  if (variant === 'loading') {
    return (
      <div className="state-block state-block--loading">
        <Spinner size="lg" />
        <p className="state-block__message">{message ?? 'Cargando…'}</p>
      </div>
    );
  }

  const Icon = variant === 'error' ? AlertTriangle : Inbox;
  const defaultTitle = variant === 'error' ? 'Algo salió mal' : 'Todavía no hay nada por acá';

  return (
    <div className={`state-block state-block--${variant}`}>
      <Icon className="state-block__icon" aria-hidden="true" />
      <h2 className="state-block__title">{title ?? defaultTitle}</h2>
      {message && <p className="state-block__message">{message}</p>}
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" />
          Reintentar
        </Button>
      )}
      {action}
    </div>
  );
}
