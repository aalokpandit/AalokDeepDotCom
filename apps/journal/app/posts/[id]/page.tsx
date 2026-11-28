import { redirect } from 'next/navigation';

interface PostDetailRedirectProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PostDetailRedirect({ params }: PostDetailRedirectProps) {
  const { id } = await params;
  redirect(`/blogs/${id}`);
}
