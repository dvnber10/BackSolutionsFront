import { HeartHandshake, Lightbulb, ShieldCheck, Target } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHeader } from '../components/ui/PageHeader';
import { Section } from '../components/layout/Section';
import { CtaBand } from '../components/content/CtaBand';
import { useSiteSettings } from '../features/content/queries';
import './About.scss';

const VALUES = [
  {
    icon: Target,
    title: 'Foco en el resultado',
    text: 'No entregamos features: entregamos problemas resueltos y objetivos cumplidos.',
  },
  {
    icon: Lightbulb,
    title: 'Criterio técnico',
    text: 'Elegimos la tecnología por lo que conviene al proyecto, no por moda.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparencia',
    text: 'Alcance claro, comunicación directa y sin sorpresas en el camino.',
  },
  {
    icon: HeartHandshake,
    title: 'Compromiso',
    text: 'Nos involucramos en el negocio como si fuera propio.',
  },
];

export default function About() {
  const settings = useSiteSettings();
  const company = settings.data?.companyName ?? 'BackSolutions';

  return (
    <>
      <SEO
        title="Nosotros"
        description="Somos un equipo de desarrollo de software enfocado en resultados."
        path="/about"
      />

      <PageHeader
        eyebrow="Nosotros"
        title="Un equipo pequeño, obsesionado con hacer las cosas bien"
        intro={`${company} nació para ayudar a negocios de todos los tamaños a construir productos digitales sólidos, medibles y sostenibles en el tiempo.`}
      />

      <Section>
        <div className="about-story">
          <div className="about-story__text">
            <p>
              Trabajamos codo a codo con nuestros clientes, entendiendo primero el problema
              de negocio y recién después eligiendo la tecnología. Creemos que el mejor
              software es el que resuelve, se mantiene y crece sin dolores de cabeza.
            </p>
            <p>
              Preferimos pocos proyectos bien hechos antes que muchos a medias. Por eso
              armamos equipos pequeños, con comunicación directa y una mirada de largo plazo
              sobre cada producto que tocamos.
            </p>
          </div>

          <ul className="about-values">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <li className="about-values__item" key={title}>
                <span className="about-values__icon">
                  <Icon aria-hidden="true" />
                </span>
                <div>
                  <h3 className="about-values__title">{title}</h3>
                  <p className="about-values__text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CtaBand
        title="¿Trabajamos juntos?"
        text="Cuentanos qué tienes en mente y vemos cómo podemos ayudarte."
        buttonLabel="Hablemos"
      />
    </>
  );
}
