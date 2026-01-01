import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Collapsible from '@/components/Collapsible';
import { getProjectById, getAllProjects } from '@/lib/projects';

export function generateStaticParams() {
  const projects = getAllProjects();
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const project = getProjectById(params.id);

  if (!project) {
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
              The project you're looking for doesn't exist.
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
          {/* Introduction Section */}
          <Collapsible title="Introduction" defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  About
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {project.introduction}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  Motivation
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {project.motivation}
                </p>
              </div>
            </div>
          </Collapsible>

          {/* Progress Log Section */}
          <Collapsible title="Progress Log" defaultOpen={false}>
            <div className="space-y-6">
              {project.progressLog.length > 0 ? (
                project.progressLog.map((entry, index) => (
                  <div key={index} className="pb-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0 last:pb-0">
                    <time className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <p className="text-slate-700 dark:text-slate-300 mt-1">
                      {entry.accomplishment}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  No progress entries yet.
                </p>
              )}
            </div>
          </Collapsible>

          {/* Live Link Section */}
          {project.liveLink && (
            <Collapsible title="Live Demo" defaultOpen={false}>
              <div className="space-y-4">
                <p className="text-slate-700 dark:text-slate-300">
                  Interact with the project directly using the link below:
                </p>
                <a
                  href={project.liveLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {project.liveLink.label}
                </a>
              </div>
            </Collapsible>
          )}
        </section>
      </div>
    </main>
  );
}
