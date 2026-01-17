import ProjectDetailClient from './ProjectDetailClient';

interface ProjectDetailPageProps {
  params: { id: string };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  return <ProjectDetailClient projectId={params.id} />;
}
