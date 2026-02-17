'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
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
    <Link href={`/blogs/${post.id}`} className="block h-full">
      <article className="group h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-slate-200 min-h-[300px]">
        {hasHero && showImage ? (
          <div className="relative aspect-square w-full bg-slate-200 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.heroImage?.url}
              alt={post.heroImage?.alt || post.title}
              className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setShowImage(false)}
            />
          </div>
        ) : (
          <div className="relative aspect-square w-full bg-slate-200 overflow-hidden flex items-center justify-center">
            <span className="px-4 text-center text-sm text-slate-600">
              {post.heroImage?.alt || 'Image unavailable'}
            </span>
          </div>
        )}

        <div className="p-6 flex flex-col h-full">
          <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">
            {formatPostDate(post.createdAt)}
          </p>
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-slate-600 text-sm flex-grow mb-4 line-clamp-3">
            {post.summary}
          </p>

          <div className="mt-auto space-y-4">
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
            <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all duration-300">
              <span>View Details</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
