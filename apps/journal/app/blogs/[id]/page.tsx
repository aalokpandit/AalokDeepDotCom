import { getBlogById } from '@/lib/blogs';
import PostDetailClient from './PostDetailClient';

// Server-rendered per request so crawlers/agents get fully populated HTML without a rebuild.
export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const post = await getBlogById(id);

  return <PostDetailClient post={post} />;
}