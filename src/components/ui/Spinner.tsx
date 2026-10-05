import './Spinner.scss';

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
};

/** Indicador de carga accesible: `role="status"` anunciado por lectores de pantalla. */
export function Spinner({ size = 'md', label = 'Cargando' }: SpinnerProps) {
  return <span className={`spinner spinner--${size}`} role="status" aria-label={label} />;
}
