import { SEO } from '../components/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/layout/Section';
import { StateBlock } from '../components/ui/StateBlock';
import { ServiceCard } from '../components/content/ServiceCard';
import { CtaBand } from '../components/content/CtaBand';
import { useServices } from '../features/content/queries';
import './Services.scss';

const PROCESS = [
  {
    step: '01',
    title: 'Descubrimiento',
    text: 'Entendemos el negocio, los objetivos y las restricciones antes de escribir una línea de código.',
  },
  {
    step: '02',
    title: 'Diseño',
    text: 'Prototipamos la experiencia y validamos el flujo con vos para no construir sobre suposiciones.',
  },
  {
    step: '03',
    title: 'Desarrollo',
    text: 'Construimos por iteraciones, con entregas visibles y testeables en cada etapa.',
  },
  {
    step: '04',
    title: 'Lanzamiento y soporte',
    text: 'Publicamos, medimos resultados y acompañamos la evolución del producto.',
  },
];

export default function Services() {
  const services = useServices();

  return (
    <>
      <SEO
        title="Servicios"
        description="Diseño y desarrollo web, plataformas a medida, optimización de rendimiento y consultoría técnica."
        path="/services"
      />

      <PageHeader
        eyebrow="Servicios"
        title="Lo que podemos construir con vos"
        intro="Trabajamos en todo el ciclo del producto digital: desde una landing que convierte hasta una plataforma interna con panel de gestión."
      />

      <Section>
        {services.isLoading && <StateBlock variant="loading" message="Cargando servicios…" />}
        {services.isError && (
          <StateBlock
            variant="error"
            title="No pudimos cargar los servicios"
            onRetry={() => services.refetch()}
          />
        )}
        {services.data && services.data.length === 0 && (
          <StateBlock variant="empty" message="Todavía no hay servicios publicados." />
        )}
        {services.data && services.data.length > 0 && (
          <div className="grid grid--3">
            {services.data.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </Section>

      <Section
        tone="muted"
        eyebrow="Proceso"
        title="Cómo trabajamos"
        intro="Un método simple y transparente, pensado para que sepas siempre en qué etapa está tu proyecto."
      >
        <ol className="process">
          {PROCESS.map((item) => (
            <li className="process__item" key={item.step}>
              <span className="process__step" aria-hidden="true">
                {item.step}
              </span>
              <h3 className="process__title">{item.title}</h3>
              <p className="process__text">{item.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        title="¿No sabés qué servicio necesitás?"
        text="Contanos el objetivo y te ayudamos a definir el alcance y el camino más corto para llegar."
        buttonLabel="Pedir asesoría"
      />
    </>
  );
}
