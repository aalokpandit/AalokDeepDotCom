'use client';

import ProjectCard, { ProjectCardData } from './ProjectCard';

interface ProjectListProps {
  projects: ProjectCardData[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  // Defensive check: ensure projects is an array
  if (!Array.isArray(projects)) {
    console.error('ProjectList: projects is not an array', projects);
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-red-500">
          Error loading projects: Invalid data format
        </p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-slate-500 dark:text-slate-400">
          No projects available yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
