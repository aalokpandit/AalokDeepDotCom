import { redirect } from 'next/navigation';

interface PostDetailRedirectProps {
  params: {
    id: string;
  };
}

export default function PostDetailRedirect({ params }: PostDetailRedirectProps) {
  redirect(`/blogs/${params.id}`);
}
