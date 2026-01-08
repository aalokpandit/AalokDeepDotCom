import ProjectDetailClient from './ProjectDetailClient';

interface ProjectDetailPageProps {
  params: { id: string };
}

// Generate static params at build time for static export
export async function generateStaticParams() {
  // Fallback project IDs in case API fetch fails during build
  const fallbackIds = [
    { id: 'personal-website' },
    { id: 'classic-memory-game' },
  ];

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';
    const response = await fetch(`${apiBase}/api/projects`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return fallbackIds;
    }

    const data = await response.json();
    const projects = data.data || [];

    if (projects.length === 0) {
      return fallbackIds;
    }

    return projects.map((project: { id: string }) => ({
      id: project.id,
    }));
  } catch (error) {
    return fallbackIds;
  }
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return <ProjectDetailClient projectId={params.id} />;
}
