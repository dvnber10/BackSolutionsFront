import './Prose.scss';

type ProseProps = {
  html: string;
  className?: string;
};

/**
 * Renderiza HTML rico que viene del CMS (páginas y artículos del blog).
 *
 * Se usa `dangerouslySetInnerHTML` porque el contenido lo cargan Owner/Admin desde el
 * panel, no un visitante. Si en algún momento se abre la edición a terceros, hay que
 * sanitizar antes de renderizar.
 */
export function Prose({ html, className }: ProseProps) {
  return (
    <div
      className={`prose${className ? ` ${className}` : ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
