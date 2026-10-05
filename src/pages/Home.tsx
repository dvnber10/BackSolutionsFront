import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Gauge, MessagesSquare, ShieldCheck } from 'lucide-react';
import { SEO } from '../components/SEO';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { StateBlock } from '../components/ui/StateBlock';
import { ServiceCard } from '../components/content/ServiceCard';
import { ProjectCard } from '../components/content/ProjectCard';
import { BlogCard } from '../components/content/BlogCard';
import {
  useBlogPosts,
  usePortfolio,
  useServices,
  useSiteSettings,
} from '../features/content/queries';
import './Home.scss';

const FALLBACK_HERO = {
  title: 'Impulsamos negocios con software a medida.',
  subtitle:
    'Diseñamos y desarrollamos sitios, plataformas y productos digitales que escalan con tu negocio.',
};

const PILLARS = [
  {
    icon: Code2,
    title: 'Desarrollo a medida',
    text: 'Landing pages, plataformas y sistemas internos construidos sobre tecnología sólida.',
  },
  {
    icon: Gauge,
    title: 'Rendimiento real',
    text: 'Optimizamos cada milisegundo porque la velocidad se traduce en conversión.',
  },
  {
    icon: ShieldCheck,
    title: 'Seguro y mantenible',
    text: 'Buenas prácticas, tests y arquitecturas pensadas para durar y crecer.',
  },
  {
    icon: MessagesSquare,
    title: 'Acompañamiento',
    text: 'Trabajamos cerca del negocio, del primer boceto al soporte en producción.',
  },
];

const STATS = [
  // { value: '+10', label: 'proyectos entregados' },
  { value: '24/7', label: 'soporte y monitoreo' },
  { value: '100%', label: 'enfoque en resultados' },
];

export default function Home() {
  const settings = useSiteSettings();
  const services = useServices();
  const projects = usePortfolio(true);
  const posts = useBlogPosts({ page: 1, pageSize: 3 });

  const hero = settings.data?.hero;
  const heroTitle = hero?.title?.trim() || FALLBACK_HERO.title;
  const heroSubtitle = hero?.subtitle?.trim() || FALLBACK_HERO.subtitle;

  return (
    <>
      <SEO
        title="Inicio"
        description={heroSubtitle}
        path="/"
      />

      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <p className="hero__eyebrow">Tecnología a medida</p>
            <h1 className="hero__title">{heroTitle}</h1>
            <p className="hero__subtitle">{heroSubtitle}</p>

            <div className="hero__actions">
              <Button to="/contact" size="lg">
                Solicitar propuesta
              </Button>
              <Button to="/portfolio" variant="secondary" size="lg">
                Ver proyectos
              </Button>
            </div>

            <dl className="hero__stats">
              {STATS.map((stat) => (
                <div className="hero__stat" key={stat.label}>
                  <dt>{stat.value}</dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="hero__panel" aria-hidden="true">
            <div className="hero__window">
              <div className="hero__window-bar">
                <span />
                <span />
                <span />
              </div>
              <pre className="hero__code">{`const equipo = await BackSolutions
  .diseñar(idea)
  .construir(objetivo)
  .medir(resultados);`}</pre>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Qué hacemos"
        title="Un equipo para todo el ciclo del producto"
        intro="Estrategia, diseño, desarrollo y soporte. Sin pasamanos: una sola mirada sobre el proyecto."
      >
        <ul className="pillars">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <li className="pillar" key={title}>
              <span className="pillar__icon">
                <Icon aria-hidden="true" />
              </span>
              <h3 className="pillar__title">{title}</h3>
              <p className="pillar__text">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        tone="muted"
        eyebrow="Servicios"
        title="Soluciones que se adaptan a tu etapa"
        intro="Desde una landing hasta una plataforma completa con panel de gestión."
        action={
          <Link className="section-link" to="/services">
            Ver todos
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      >
        {services.isLoading && <StateBlock variant="loading" message="Cargando servicios…" />}
        {services.isError && (
          <StateBlock
            variant="error"
            title="No pudimos cargar los servicios"
            message="Probá de nuevo en unos segundos."
            onRetry={() => services.refetch()}
          />
        )}
        {services.data && services.data.length === 0 && (
          <StateBlock variant="empty" message="Todavía no hay servicios publicados." />
        )}
        {services.data && services.data.length > 0 && (
          <div className="grid grid--3">
            {services.data.slice(0, 6).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </Section>

      <Section
        eyebrow="Portafolio"
        title="Proyectos que hablan por nosotros"
        intro="Algunos de los trabajos que salieron del taller."
        action={
          <Link className="section-link" to="/portfolio">
            Ver portafolio
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      >
        {projects.isLoading && <StateBlock variant="loading" message="Cargando proyectos…" />}
        {projects.isError && (
          <StateBlock
            variant="error"
            title="No pudimos cargar el portafolio"
            onRetry={() => projects.refetch()}
          />
        )}
        {projects.data && projects.data.length === 0 && (
          <StateBlock variant="empty" message="Todavía no hay proyectos destacados." />
        )}
        {projects.data && projects.data.length > 0 && (
          <div className="grid grid--3">
            {projects.data.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </Section>

      <section className="cta-band">
        <div className="cta-band__inner">
          <div>
            <h2 className="cta-band__title">¿Tenés un proyecto en mente?</h2>
            <p className="cta-band__text">
              Contanos qué necesitás y te devolvemos una propuesta clara, sin vueltas.
            </p>
          </div>
          <Button to="/contact" size="lg" variant="secondary">
            Hablemos
          </Button>
        </div>
      </section>

      <Section
        eyebrow="Blog"
        title="Notas y aprendizajes"
        intro="Lo que vamos aprendiendo mientras construimos."
        action={
          <Link className="section-link" to="/blog">
            Ver el blog
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        }
      >
        {posts.isLoading && <StateBlock variant="loading" message="Cargando artículos…" />}
        {posts.isError && (
          <StateBlock
            variant="error"
            title="No pudimos cargar el blog"
            onRetry={() => posts.refetch()}
          />
        )}
        {posts.data && posts.data.items.length === 0 && (
          <StateBlock variant="empty" message="Todavía no hay artículos publicados." />
        )}
        {posts.data && posts.data.items.length > 0 && (
          <div className="grid grid--3">
            {posts.data.items.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
