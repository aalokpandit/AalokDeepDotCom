import type { Metadata } from 'next';
import PostDetailClient from './PostDetailClient';
import { getBlogById } from '@/lib/blogs';

interface PostDetailPageProps {
  params: {
    id: string;
  };
}

const JOURNAL_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL_JOURNAL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

function absoluteUrl(pathname: string): string {
  return new URL(pathname, JOURNAL_SITE_URL).toString();
}

function normalizeImageUrl(imageUrl?: string): string | undefined {
  if (!imageUrl) return undefined;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return absoluteUrl(normalizedPath);
}

export async function generateMetadata({ params }: PostDetailPageProps): Promise<Metadata> {
  const post = await getBlogById(params.id);

  if (!post) {
    return {
      title: 'Post Not Found | Journal | Aalok Deep Pandit',
      description: 'Long-form journal entries and updates from Aalok Deep Pandit.',
    };
  }

  const canonicalUrl = absoluteUrl(`/blogs/${post.id}`);
  const description = post.summary || 'Long-form journal entries and updates from Aalok Deep Pandit.';
  const heroImageUrl = normalizeImageUrl(post.heroImage?.url);
  const heroImageAlt = post.heroImage?.alt || post.title;

  return {
    title: `${post.title} | Journal | Aalok Deep Pandit`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonicalUrl,
      type: 'article',
      siteName: 'Journal | Aalok Deep Pandit',
      images: heroImageUrl
        ? [
            {
              url: heroImageUrl,
              alt: heroImageAlt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: heroImageUrl ? 'summary_large_image' : 'summary',
      title: post.title,
      description,
      images: heroImageUrl ? [heroImageUrl] : undefined,
    },
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  return <PostDetailClient postId={params.id} />;
}