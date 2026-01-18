'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Collapsible from '@/components/Collapsible';
import type { Project } from '@aalokdeep/types';

interface ProjectDetailClientProps {
  projectId: string;
}

/**
 * Client component that fetches and displays full project details
 * Uses useEffect for client-side data fetching from API
 * Handles loading, error, and not-found states with appropriate UI
 * 
 * @param {Object} props - Component props
 * @param {string} props.projectId - The project ID to fetch and display
 */
export default function ProjectDetailClient({ projectId }: ProjectDetailClientProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';
        const response = await fetch(`${apiBase}/api/projects/${projectId}`);

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
        console.error(`[ProjectDetail] Error fetching project ${projectId}:`, err);
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [projectId]);

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
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">
            {project.title}
          </h1>
          <p className="text-lg text-slate-700 leading-relaxed">
            {project.description}
          </p>
        </section>

        {/* About Section */}
        <Collapsible title="About This Project" defaultOpen={true}>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {project.detailedDescription}
            </p>
          </div>
        </Collapsible>

        {/* Progress Log Section */}
        {project.progressLog && project.progressLog.length > 0 && (
          <Collapsible title="Progress Log" defaultOpen={false}>
            <div className="space-y-6">
              {project.progressLog.map((entry, index) => (
                <div key={index} className="border-l-2 border-blue-200 pl-4">
                  <time className="text-sm font-semibold text-blue-600">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <p className="text-slate-700 mt-1">{entry.description}</p>
                </div>
              ))}
            </div>
          </Collapsible>
        )}

        {/* Links Section */}
        {project.links && project.links.length > 0 && (
          <Collapsible title="Links & Resources" defaultOpen={false}>
            <div className="space-y-3">
              {project.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <span>{link.title}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </Collapsible>
        )}
      </div>
    </main>
  );
}
