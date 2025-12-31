'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ComingSoonProps {
  /** The path to return to, e.g., "/" or "/blog" */
  homePath: string;
}

export function ComingSoon({ homePath }: ComingSoonProps) {
  const searchParams = useSearchParams();
  const featureName = searchParams.get('feature');

  return (
    <section className="min-h-[60vh] flex items-center justify-center text-center p-6">
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-5xl font-serif font-bold text-slate-900">Coming Soon!</h1>

        {featureName ? (
          <p className="text-xl text-slate-600">
            The feature you're looking for, <strong>&ldquo;{featureName},&rdquo;</strong> is currently under construction.
          </p>
        ) : (
          <p className="text-xl text-slate-600">
            This section of the website is currently under construction.
          </p>
        )}

        <p className="text-lg text-slate-500">
          Please check back soon to see what&apos;s new. We appreciate your patience!
        </p>

        <Link
          href={homePath}
          className="inline-block px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors duration-300"
        >
          Return to Home
        </Link>
      </div>
    </section>
  );
}
