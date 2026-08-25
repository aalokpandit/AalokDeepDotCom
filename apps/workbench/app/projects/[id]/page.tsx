import { getProjectById } from '@/lib/projects';
import ProjectDetailClient from './ProjectDetailClient';

// Server-rendered per request so crawlers/agents get fully populated HTML without a rebuild.
export const dynamic = 'force-dynamic';

interface ProjectDetailPageProps {
  params: { id: string };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = await getProjectById(params.id);

  return <ProjectDetailClient project={project} />;
}