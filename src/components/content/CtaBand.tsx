import { Button } from '../ui/Button';
import './CtaBand.scss';

type CtaBandProps = {
  title: string;
  text: string;
  buttonLabel?: string;
  to?: string;
};

/** Banda de acción reutilizable al final de secciones y páginas. */
export function CtaBand({
  title,
  text,
  buttonLabel = 'Hablemos',
  to = '/contact',
}: CtaBandProps) {
  return (
    <section className="cta-band">
      <div className="cta-band__inner">
        <div className="cta-band__copy">
          <h2 className="cta-band__title">{title}</h2>
          <p className="cta-band__text">{text}</p>
        </div>
        <Button to={to} size="lg" variant="secondary">
          {buttonLabel}
        </Button>
      </div>
    </section>
  );
}
