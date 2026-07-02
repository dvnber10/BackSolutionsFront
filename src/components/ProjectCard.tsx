// RUTA: src/components/ProjectCard.tsx
import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const statusLabel = {
    completed: 'Completado',
    'in-progress': 'En desarrollo',
    planned: 'Planeado',
  };

  const statusClass = {
    completed: 'status-completed',
    'in-progress': 'status-inprogress',
    planned: 'status-planned',
  };

  return (
    <article className="project-card">
      <div className="project-image-wrapper">
        {project.image ? (
          <img src={project.image} alt={project.name} className="project-image" />
        ) : (
          <div className="project-image-placeholder">
            <span>{project.name.substring(0, 2).toUpperCase()}</span>
          </div>
        )}
        <span className={`project-status ${statusClass[project.status]}`}>
          {statusLabel[project.status]}
        </span>
      </div>
      <div className="project-content">
        <h3>{project.name}</h3>
        <p className="project-category">{project.category}</p>
        <p className="project-description">{project.description}</p>
        <div className="project-tech">
          {project.technologies.map((tech) => (
            <span key={tech} className="tech-badge">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};
