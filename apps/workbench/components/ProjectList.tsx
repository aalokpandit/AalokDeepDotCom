'use client';

import ProjectCard, { ProjectData } from './ProjectCard';

interface ProjectListProps {
  projects: ProjectData[];
}

export default function ProjectList({ projects }: ProjectListProps) {
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
