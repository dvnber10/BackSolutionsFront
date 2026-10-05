import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Atajo para abrir el panel desde cualquier página: `Ctrl+Shift+A` (`Cmd+Shift+A` en Mac).
 *
 * Es una comodidad, no una medida de seguridad. Las rutas del panel están escritas en el
 * bundle público, así que cualquiera que abra el fuente las ve: lo único que protege el
 * panel es el JWT y las políticas de rol. Encerrar el acceso detrás de una combinación
 * secreta no agrega nada.
 *
 * Se navega con el router y no con `location.href` a propósito. La app ya está cargada, y
 * pedirle `/admin/login` al servidor en una carga completa es justo lo que rompe el rewrite
 * de `vercel.json` cuando este todavía no está desplegado.
 */
export function AdminShortcut() {
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      // Ctrl en Windows y Linux, Cmd en macOS: el resto de la combinación es igual.
      if (!event.shiftKey || (!event.ctrlKey && !event.metaKey)) {
        return;
      }

      if (event.key.toLowerCase() !== 'a') {
        return;
      }

      // Si el foco está en un campo, la combinación es del campo y no del panel.
      const target = event.target as HTMLElement | null;

      if (target?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }

      event.preventDefault();
      navigate('/admin/login');
    }

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  return null;
}