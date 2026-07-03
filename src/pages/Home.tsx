
// RUTA: src/pages/Home.tsx
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

const Home = () => (
  <>
    <SEO
      title="Inicio"
      description="Creamos soluciones web modernas, escalables y orientadas a resultados para marcas que quieren crecer con confianza."
      path="/"
    />
    <div className="page-shell">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Tecnología a medida</span>
          <h1>Impulsamos negocios con experiencias digitales profesionales.</h1>
          <p>
            Creamos soluciones web modernas, escalables y orientadas a resultados para marcas que quieren crecer con confianza.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/contact">Solicitar cotización</Link>
            <Link className="btn btn-secondary" to="/portfolio">Ver proyectos</Link>
          </div>
          <div className="stats">
            <div className="stat-card">
              <strong>+50</strong>
              <span>proyectos entregados</span>
            </div>
            <div className="stat-card">
              <strong>24/7</strong>
              <span>soporte y acompañamiento</span>
            </div>
            <div className="stat-card">
              <strong>100%</strong>
              <span>enfoque en resultados</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card">
            <h3>Soluciones completas</h3>
            <p>Diseño, desarrollo, rendimiento y estrategia digital en un solo equipo.</p>
          </div>
          <div className="panel-card">
            <h3>Diseño premium</h3>
            <p>Interfaces modernas, limpias y preparadas para convertir visitantes en clientes.</p>
          </div>
          <div className="panel-card">
            <h3>Escalable y seguro</h3>
            <p>Arquitecturas pensadas para crecer con tu negocio y tus usuarios.</p>
          </div>
        </div>
      </section>

      <section className="card-grid">
        <article className="info-card">
          <h3>Desarrollo web</h3>
          <p>Landing pages, plataformas y ecommerce con una experiencia cuidada al detalle.</p>
        </article>
        <article className="info-card">
          <h3>Optimización</h3>
          <p>Mejoramos el rendimiento, la usabilidad y la conversión de tus productos digitales.</p>
        </article>
        <article className="info-card">
          <h3>Consultoría</h3>
          <p>Asesoramos tu proyecto desde la estrategia hasta la implementación final.</p>
        </article>
      </section>
    </div>
  </>
);

export default Home;
