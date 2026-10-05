import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { PortfolioProject } from '../../features/content/types';
import { Badge } from '../ui/Badge';
import './ProjectCard.scss';

export function ProjectCard({ project }: { project: PortfolioProject }) {
  return (
    <article className="project-card">
      <Link
        className="project-card__media"
        to={`/portfolio/${project.slug}`}
        aria-label={`Ver proyecto ${project.title}`}
        tabIndex={-1}
      >
        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={project.coverImageAlt ?? project.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="project-card__placeholder" aria-hidden="true">
            {project.title.charAt(0).toUpperCase()}
          </span>
        )}
      </Link>

      <div className="project-card__body">
        {project.clientName && <p className="project-card__client">{project.clientName}</p>}
        <h3 className="project-card__title">
          <Link to={`/portfolio/${project.slug}`}>{project.title}</Link>
        </h3>
        <p className="project-card__summary">{project.summary}</p>

        {project.techStack.length > 0 && (
          <ul className="project-card__stack" aria-label="Tecnologías">
            {project.techStack.slice(0, 4).map((tech) => (
              <li key={tech}>
                <Badge>{tech}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ArrowUpRight className="project-card__arrow" aria-hidden="true" />
    </article>
  );
}
