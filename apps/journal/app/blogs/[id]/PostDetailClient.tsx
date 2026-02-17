'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowLeft } from 'lucide-react';
import type { Blog } from '@aalokdeep/types';
import { getBlogById } from '@/lib/blogs';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripLeadingTitle(html: string, title?: string) {
  if (!html || !title) return html;
  const normalized = escapeRegExp(title.trim());
  const pattern = new RegExp(`^\\s*<h[1-3][^>]*>\\s*${normalized}\\s*</h[1-3]>\\s*`, 'i');
  return html.replace(pattern, '');
}

function formatPostDate(dateStr: string) {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  const d = isDateOnly ? new Date(`${dateStr}T00:00:00`) : new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

interface PostDetailClientProps {
  postId: string;
}

export default function PostDetailClient({ postId }: PostDetailClientProps) {
  const [post, setPost] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogById(postId);
        if (!data) {
          setError('Post not found');
        }
        setPost(data);
      } catch (err) {
        console.error('Failed to load post', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [postId]);

  const heroAlt = post?.heroImage?.alt || post?.title;
  const hasHero = Boolean(post?.heroImage?.url) && showImage;

  const renderedBody = useMemo(() => {
    if (!post?.body) return '';
    const normalized = post.body.replace(/\\n/g, '\n');
    const html = marked.parse(normalized, { async: false, breaks: true }) as string;
    const withoutTitle = stripLeadingTitle(html, post.title);
    return DOMPurify.sanitize(withoutTitle);
  }, [post?.body, post?.title]);

  const header = (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors"
    >
      <ArrowLeft size={18} />
      Back to Journal
    </Link>
  );

  if (loading) {
    return (
      <main className="bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
          {header}
          <div className="text-center">
            <p className="text-slate-600">Loading post...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="bg-[#FDFBF7]">
        <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
          {header}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Post Not Found</h1>
            <p className="text-slate-600">{error || 'The post you are looking for does not exist.'}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
        {header}

        <section className="mb-12">
          <p className="text-sm uppercase tracking-wide text-slate-500 mb-2">
            {formatPostDate(post.createdAt)}
          </p>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-4">{post.title}</h1>
          <p className="text-lg text-slate-700 leading-relaxed">{post.summary}</p>
        </section>

        {hasHero && (
          <div className="mb-8">
            <div className="relative w-full sm:w-1/2 mx-auto aspect-square rounded-lg overflow-hidden border border-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.heroImage?.url}
                alt={heroAlt}
                className="w-full h-full object-cover"
                onError={() => setShowImage(false)}
              />
            </div>
          </div>
        )}

        {!showImage && post.heroImage && (
          <div className="rounded-xl bg-slate-100 px-4 py-6 text-sm text-slate-600">
            {heroAlt || 'Image unavailable'}
          </div>
        )}

        <section
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedBody }}
        />

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}