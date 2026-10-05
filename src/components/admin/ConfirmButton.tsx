import { useState, type ReactNode } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import './ConfirmButton.scss';

type ConfirmButtonProps = {
  onConfirm: () => void;
  label?: string;
  confirmLabel?: string;
  loading?: boolean;
  icon?: ReactNode;
};

/** Acción destructiva con confirmación en línea, sin modal. */
export function ConfirmButton({
  onConfirm,
  label = 'Eliminar',
  confirmLabel = 'Confirmar',
  loading = false,
  icon,
}: ConfirmButtonProps) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <span className="confirm">
        <button
          type="button"
          className="confirm__yes"
          disabled={loading}
          onClick={() => {
            setConfirming(false);
            onConfirm();
          }}
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          className="confirm__no"
          onClick={() => setConfirming(false)}
        >
          Cancelar
        </button>
      </span>
    );
  }

  return (
    <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
      {icon ?? <Trash2 size={16} aria-hidden="true" />}
      {label}
    </Button>
  );
}
