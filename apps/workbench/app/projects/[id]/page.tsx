'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Collapsible from '@/components/Collapsible';
import type { Project } from '@aalokdeep/types';

interface ProjectDetailPageProps {
  params: { id: string };
}

// Generate static params at build time for static export
export async function generateStaticParams() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';
    const response = await fetch(`${apiBase}/api/projects`);
    
    if (!response.ok) {
      console.warn('Failed to fetch projects for generateStaticParams, returning empty array');
      return [];
    }
    
    const data = await response.json();
    const projects = data.data || [];
    
    return projects.map((project: { id: string }) => ({
      id: project.id,
    }));
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    return [];
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';
        const response = await fetch(`${apiBase}/api/projects/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setProject(null);
          } else {
            throw new Error('Failed to fetch project');
          }
        } else {
          const data = await response.json();
          setProject(data.data || null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <main className="bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Workbench
          </Link>
          <div className="text-center">
            <p className="text-slate-600">Loading project...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Workbench
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Project Not Found
            </h1>
            <p className="text-slate-600">
              {error || 'The project you\'re looking for doesn\'t exist.'}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Workbench
        </Link>

        {/* Header */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
            {project.title}
          </h1>
        </section>

        {/* Collapsible Sections */}
        <section className="space-y-4">
          {/* Introduction & Motivation Section */}
          <Collapsible title="About" defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Details
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {project.detailedDescription}
                </p>
              </div>
            </div>
          </Collapsible>

          {/* Progress Log Section */}
          <Collapsible title="Progress Log" defaultOpen={false}>
            <div className="space-y-6">
              {project.progressLog.length > 0 ? (
                project.progressLog.map((entry, index) => (
                  <div
                    key={index}
                    className="pb-6 border-b border-slate-200 last:border-b-0 last:pb-0"
                  >
                    <time className="text-sm font-semibold text-blue-600">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <p className="text-slate-700 mt-1">{entry.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No progress entries yet.</p>
              )}
            </div>
          </Collapsible>

          {/* Links Section */}
          {project.links && project.links.length > 0 && (
            <Collapsible title="Links" defaultOpen={false}>
              <div className="space-y-3">
                {project.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    {link.title}
                  </a>
                ))}
              </div>
            </Collapsible>
          )}
        </section>
      </div>
    </main>
  );
}
