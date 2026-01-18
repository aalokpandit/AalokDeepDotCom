'use client';

import { useParams } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params?.id as string;

  return <ProjectDetailClient projectId={projectId} />;
}
