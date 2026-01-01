'use client';

import ProjectList from '@/components/ProjectList';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllProjects } from '@/lib/projects';

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <main className="bg-[#FDFBF7] text-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Workbench
        </Link>

        {/* Header */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
            All Projects
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl">
            Browse all projects from the workbench. Each project includes detailed information,
            a progress log, and links to live implementations or demos.
          </p>
        </section>

        {/* Projects Grid */}
        <ProjectList projects={projects} />
      </div>
    </main>
  );
}
