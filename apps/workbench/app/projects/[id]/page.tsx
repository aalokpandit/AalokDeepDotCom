import ProjectDetailClient from './ProjectDetailClient';

interface ProjectDetailPageProps {
  params: { id: string };
}

// Generate static params at build time for static export
export async function generateStaticParams() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';
    const response = await fetch(`${apiBase}/api/projects`, {
      cache: 'no-store',
    });
    
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
  return <ProjectDetailClient projectId={params.id} />;
}
