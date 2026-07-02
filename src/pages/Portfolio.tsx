// RUTA: src/pages/Portfolio.tsx
import { projects } from '../data/projects';
import { ProjectCard } from '../components/ProjectCard';

const Portfolio = () => (
  <div className="page-shell">
    <section className="page-section">
      <span className="eyebrow">Portafolio</span>
      <h1>Portafolio de Proyectos</h1>
      <p>Explora algunos de los trabajos que han ayudado a transformar negocios digitales.</p>
    </section>
    <section className="projects-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </section>
  </div>
);
export default Portfolio;
