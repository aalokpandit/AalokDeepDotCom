'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import type { Blog } from '@aalokdeep/types';
import { getBlogById } from '@/lib/blogs';

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
        <div className="mx-auto max-w-3xl px-4 py-12 text-slate-800 md:py-16">
          {header}
          <div className="text-slate-600">Loading post...</div>
        </div>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="bg-[#FDFBF7]">
        <div className="mx-auto max-w-3xl px-4 py-12 text-slate-800 md:py-16">
          {header}
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Post not found</h1>
          <p className="text-slate-600">{error || 'The post you are looking for does not exist.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#FDFBF7]">
      <div className="mx-auto max-w-3xl px-4 py-12 text-slate-800 md:py-16">
        {header}

        <article className="space-y-6">
          <header className="space-y-2">
            <p className="text-sm uppercase tracking-wide text-slate-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <h1 className="text-4xl font-bold text-slate-900">{post.title}</h1>
            <p className="text-lg text-slate-700">{post.summary}</p>
          </header>

          {hasHero && (
            <div className="overflow-hidden rounded-xl bg-slate-100" style={{ maxWidth: '720px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.heroImage?.url}
                alt={heroAlt}
                className="w-full object-cover"
                style={{ aspectRatio: '1 / 1' }}
                onError={() => setShowImage(false)}
              />
            </div>
          )}

          {!showImage && post.heroImage && (
            <div className="rounded-xl bg-slate-100 px-4 py-6 text-sm text-slate-600">
              {heroAlt || 'Image unavailable'}
            </div>
          )}

          <section className="prose prose-slate max-w-none">
            <ReactMarkdown>{post.body}</ReactMarkdown>
          </section>

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
        </article>
      </div>
    </main>
  );
}
