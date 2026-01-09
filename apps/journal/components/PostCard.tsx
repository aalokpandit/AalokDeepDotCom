'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { BlogListItem } from '@aalokdeep/types';

interface PostCardProps {
  post: BlogListItem;
}

export function PostCard({ post }: PostCardProps) {
  const [showImage, setShowImage] = useState(true);

  const hasHero = Boolean(post.heroImage?.url);

  return (
    <article className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {hasHero && showImage && (
        <div className="aspect-square overflow-hidden rounded-t-xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.heroImage?.url}
            alt={post.heroImage?.alt || post.title}
            className="h-full w-full object-cover"
            onError={() => setShowImage(false)}
          />
        </div>
      )}

      {!showImage && hasHero && (
        <div className="rounded-t-xl bg-slate-100 px-4 py-6 text-sm text-slate-600">
          {post.heroImage?.alt || 'Image unavailable'}
        </div>
      )}

      <div className="space-y-3 px-5 py-6">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <Link
            href={`/posts/${post.id}`}
            className="text-xl font-semibold text-slate-900 hover:text-blue-700"
          >
            {post.title}
          </Link>
          <p className="text-slate-700 leading-relaxed">{post.summary}</p>
        </header>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
    </article>
  );
}
