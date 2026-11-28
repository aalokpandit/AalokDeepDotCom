import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getBlogById } from '@/lib/blogs';
import PostDetailClient from './PostDetailClient';

// Server-rendered per request so crawlers/agents get fully populated HTML without a rebuild.
export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

const JOURNAL_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL_JOURNAL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  'http://localhost:3000';

async function resolveRequestOrigin(): Promise<string> {
  const headerStore = await headers();
  const host = headerStore.get('x-forwarded-host') || headerStore.get('host');
  const protocol =
    headerStore.get('x-forwarded-proto') ||
    (host?.includes('localhost') ? 'http' : 'https');

  if (host) {
    return `${protocol}://${host}`;
  }

  return JOURNAL_SITE_URL;
}

function absoluteUrl(pathname: string, origin: string): string {
  return new URL(pathname, origin).toString();
}

function normalizeImageUrl(imageUrl: string | undefined, origin: string): string | undefined {
  if (!imageUrl) return undefined;
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const normalizedPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return absoluteUrl(normalizedPath, origin);
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getBlogById(id);
  const origin = await resolveRequestOrigin();

  if (!post) {
    return {
      title: 'Post Not Found | Journal | Aalok Deep Pandit',
      description: 'Long-form journal entries and updates from Aalok Deep Pandit.',
    };
  }

  const canonicalUrl = absoluteUrl(`/blogs/${post.id}`, origin);
  const description = post.summary || 'Long-form journal entries and updates from Aalok Deep Pandit.';
  const heroImageUrl = normalizeImageUrl(post.heroImage?.url, origin);
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

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  const post = await getBlogById(id);

  return <PostDetailClient post={post} />;
}