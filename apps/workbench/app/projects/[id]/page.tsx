import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getProjectById } from '@/lib/projects';
import ProjectDetailClient from './ProjectDetailClient';

// Server-rendered per request so crawlers/agents get fully populated HTML without a rebuild.
export const dynamic = 'force-dynamic';

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

const WORKBENCH_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL_WORKBENCH ||
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

  return WORKBENCH_SITE_URL;
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

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  const origin = await resolveRequestOrigin();

  if (!project) {
    return {
      title: 'Project Not Found | Workbench | Aalok Deep Pandit',
      description: 'A showcase of projects, experiments, and portfolio work.',
    };
  }

  const canonicalUrl = absoluteUrl(`/projects/${project.id}`, origin);
  const description = project.description || 'A showcase of projects, experiments, and portfolio work.';
  const heroImageUrl = normalizeImageUrl(project.heroImage?.url, origin);
  const heroImageAlt = project.heroImage?.alt || project.title;

  return {
    title: `${project.title} | Workbench | Aalok Deep Pandit`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: project.title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Workbench | Aalok Deep Pandit',
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
      title: project.title,
      description,
      images: heroImageUrl ? [heroImageUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);

  return <ProjectDetailClient project={project} />;
}