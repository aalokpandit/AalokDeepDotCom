import PostDetailClient from './PostDetailClient';

interface PostDetailPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const fallbackIds = [
    { id: 'welcome-to-the-journal' },
    { id: 'workbench-retrospective' },
  ];

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';
    const response = await fetch(`${apiBase}/api/blogs`, { cache: 'no-store' });

    if (!response.ok) {
      return fallbackIds;
    }

    const data = await response.json();
    const blogs = data.data || [];

    if (!Array.isArray(blogs) || blogs.length === 0) {
      return fallbackIds;
    }

    return blogs.map((blog: { id: string }) => ({ id: blog.id }));
  } catch (error) {
    console.warn('Failed to fetch blogs for generateStaticParams, using fallback ids', error);
    return fallbackIds;
  }
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  return <PostDetailClient postId={params.id} />;
}
