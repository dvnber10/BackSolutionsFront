import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../app/theme/ThemeProvider';
import './ThemeToggle.scss';

/**
 * Botón de tema. Alterna claro/oscuro.
 *
 * El ícono que se muestra es el del tema al que se va a pasar, no el actual: es la
 * convención que menos confunde. El estado accesible va en aria-pressed, así que un
 * lector de pantalla sabe si el modo oscuro está activo sin depender del ícono.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolved, toggle } = useTheme();
  const goingTo = resolved === 'dark' ? 'claro' : 'oscuro';

  return (
    <button
      type="button"
      className={['theme-toggle', className].filter(Boolean).join(' ')}
      onClick={toggle}
      aria-pressed={resolved === 'dark'}
      aria-label={`Cambiar a modo ${goingTo}`}
      title={`Cambiar a modo ${goingTo}`}
    >
      {resolved === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
