'use client';

import ProjectList from '@/components/ProjectList';
import { getAllProjects } from '@/lib/projects';

export default function WorkbenchHome() {
  const projects = getAllProjects();

  return (
    <main className="bg-[#FDFBF7] text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Header Section */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            Workbench
          </h1>
          <p className="text-lg md:text-xl text-slate-700 max-w-3xl leading-relaxed">
            Welcome to my workbench. This is a curated collection of projects, experiments, and
            explorations that showcase my work across various domains. Each project represents
            a learning opportunity, technical challenge, or creative endeavor. Explore the projects
            below to dive deeper into the details, progress, and live implementations.
          </p>
        </section>

        {/* Projects Section */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-slate-900">
            Featured Projects
          </h2>
          <ProjectList projects={projects} />
        </section>
      </div>
    </main>
  );
}
