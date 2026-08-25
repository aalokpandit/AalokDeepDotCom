import { getBlogById } from '@/lib/blogs';
import PostDetailClient from './PostDetailClient';

// Server-rendered per request so crawlers/agents get fully populated HTML without a rebuild.
export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: { id: string };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await getBlogById(params.id);

  return <PostDetailClient post={post} />;
}