'use client';

import { useEffect, useState } from 'react';
import ProjectList from '@/components/ProjectList';
import type { Project } from '@aalokdeep/types';

export default function WorkbenchHome() {
  const [projects, setProjects] = useState<
    Pick<Project, 'id' | 'title' | 'description' | 'heroImage'>[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';
        const response = await fetch(`${apiBase}/api/projects`);

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data.data || []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

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
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading projects...</p>
            </div>
          ) : (
            <ProjectList projects={projects} />
          )}
        </section>
      </div>
    </main>
  );
}
