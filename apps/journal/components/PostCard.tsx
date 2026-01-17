'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { BlogListItem } from '@aalokdeep/types';

interface PostCardProps {
  post: BlogListItem;
}

function formatPostDate(dateStr: string) {
  const isDateOnly = /^\d{4}-\d{2}-\d{2}$/.test(dateStr);
  const d = isDateOnly ? new Date(`${dateStr}T00:00:00`) : new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function PostCard({ post }: PostCardProps) {
  const [showImage, setShowImage] = useState(true);

  const hasHero = Boolean(post.heroImage?.url);

  return (
    <Link href={`/posts/${post.id}`} className="block h-full">
      <article className="h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-200">
        {hasHero && showImage && (
          <div className="relative h-48 bg-slate-100 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.heroImage?.url}
              alt={post.heroImage?.alt || post.title}
              className="h-full w-full object-cover transition-transform duration-300"
              onError={() => setShowImage(false)}
            />
          </div>
        )}

        {!showImage && hasHero && (
          <div className="rounded-t-lg bg-slate-100 px-4 py-6 text-sm text-slate-600">
            {post.heroImage?.alt || 'Image unavailable'}
          </div>
        )}

        <div className="p-6 flex flex-col h-full">
          <header className="space-y-1 mb-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {formatPostDate(post.createdAt)}
            </p>
            <h3 className="text-xl font-semibold text-slate-900 group-hover:text-blue-700">
              {post.title}
            </h3>
            <p className="text-slate-700 leading-relaxed text-sm line-clamp-3">{post.summary}</p>
          </header>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-auto">
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
    </Link>
  );
}
