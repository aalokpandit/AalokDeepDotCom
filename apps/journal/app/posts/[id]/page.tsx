'use client';

import { useParams } from 'next/navigation';
import PostDetailClient from './PostDetailClient';

export default function PostDetailPage() {
  const params = useParams();
  const postId = params?.id as string;

  return <PostDetailClient postId={postId} />;
}
