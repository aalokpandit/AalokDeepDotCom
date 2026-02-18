'use client';

import React, { useState, useEffect } from 'react';

interface SocialShareProps {
  url?: string;
  title: string;
}

export function SocialShare({ url: initialUrl = '', title }: SocialShareProps) {
  const [resolvedUrl, setResolvedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (initialUrl) {
      setResolvedUrl(initialUrl);
    } else if (typeof window !== 'undefined') {
      setResolvedUrl(window.location.href);
    }
    setCanShare(!!navigator.share);
  }, [initialUrl]);

  if (!resolvedUrl) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolvedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert(`Copy this link:\n\n${resolvedUrl}`);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, url: resolvedUrl });
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <>
      {/* Mobile: Native share button */}
      {canShare && (
        <div className="block lg:hidden mt-8 text-center">
          <button
            onClick={handleNativeShare}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>Share this Post</span>
          </button>
        </div>
      )}

      {/* Desktop: Sidebar with share buttons */}
      <div className="hidden lg:block fixed left-4 top-1/2 -translate-y-1/2 z-20">
        <div className="flex flex-col gap-3">
          {/* LinkedIn */}
          <a
            href={`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(resolvedUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 text-slate-600 hover:text-blue-600 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764 0-.975.784-1.764 1.75-1.764s1.75.789 1.75 1.764c0 .974-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.061-1.865-3.061-1.867 0-2.154 1.459-2.154 2.965v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.84-1.563 3.04 0 3.6 2.003 3.6 4.607v5.589z" />
            </svg>
          </a>

          {/* Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(resolvedUrl)}&text=${encodeURIComponent(title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 text-slate-600 hover:text-blue-600 transition-colors"
            aria-label="Share on Twitter"
          >
            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Copy Link */}
          <button
            onClick={handleCopy}
            className="p-3 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 text-slate-600 hover:text-slate-700 transition-colors"
            aria-label={copied ? 'Copied!' : 'Copy link'}
          >
            {copied ? (
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            ) : (
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
