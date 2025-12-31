import React from 'react';

const iconClasses = "h-5 w-5 fill-current";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center text-sm text-slate-600">
        <p className="text-slate-500 text-center md:text-left">© {year} Aalok Deep Pandit. All Rights Reserved.</p>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            aria-label="LinkedIn"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            href="https://www.linkedin.com/in/aalokdpandit/"
            target="_blank"
            rel="noreferrer"
          >
            <svg className={iconClasses} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.79-1.75-1.764 0-.975.784-1.764 1.75-1.764s1.75.789 1.75 1.764c0 .974-.784 1.764-1.75 1.764zm13.5 11.268h-3v-5.604c0-1.337-.026-3.061-1.865-3.061-1.867 0-2.154 1.459-2.154 2.965v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.84-1.563 3.04 0 3.6 2.003 3.6 4.607v5.589z" />
            </svg>
            <span>LinkedIn</span>
          </a>

          <a
            aria-label="GitHub"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            href="https://github.com/aalokpandit/"
            target="_blank"
            rel="noreferrer"
          >
            <svg className={iconClasses} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M12 .5c-6.63 0-12 5.37-12 12 0 5.3 3.438 9.8 8.205 11.385.6.113.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.536-1.524.116-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.654 1.652.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.624-5.476 5.92.43.37.823 1.103.823 2.222 0 1.604-.014 2.896-.014 3.286 0 .32.216.694.825.576 4.765-1.587 8.2-6.086 8.2-11.384 0-6.63-5.373-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </a>

          <a
            aria-label="General Blog"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            href="https://adpandit.blogspot.com/"
            target="_blank"
            rel="noreferrer"
          >
            <svg className={iconClasses} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M19.93 8.06c-.04-.04-.2-.17-.22-.2-.38-.35-.64-.84-.64-1.4 0-.68-.26-1.32-.74-1.8-.48-.48-1.12-.74-1.8-.74h-5.99c-2.49 0-4.51 2.02-4.51 4.51v8.02c0 2.49 2.02 4.51 4.51 4.51h7.98c2.49 0 4.51-2.02 4.51-4.51v-5.09c-.01-.63-.26-1.23-.69-1.7zm-9.59-1.22h2.95c.43 0 .78.35.78.78 0 .43-.35.78-.78.78h-2.95c-.43 0-.78-.35-.78-.78 0-.43.35-.78.78-.78zm6.43 8.83h-6.57c-.43 0-.78-.35-.78-.78 0-.43.35-.78.78-.78h6.57c.43 0 .78.35.78.78 0 .43-.35.78-.78.78z" />
            </svg>
            <span>General Blog</span>
          </a>

          <a
            aria-label="Parenting Blog"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            href="https://avyaansdad.blogspot.com/"
            target="_blank"
            rel="noreferrer"
          >
            <svg className={iconClasses} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M19.93 8.06c-.04-.04-.2-.17-.22-.2-.38-.35-.64-.84-.64-1.4 0-.68-.26-1.32-.74-1.8-.48-.48-1.12-.74-1.8-.74h-5.99c-2.49 0-4.51 2.02-4.51 4.51v8.02c0 2.49 2.02 4.51 4.51 4.51h7.98c2.49 0 4.51-2.02 4.51-4.51v-5.09c-.01-.63-.26-1.23-.69-1.7zm-9.59-1.22h2.95c.43 0 .78.35.78.78 0 .43-.35.78-.78.78h-2.95c-.43 0-.78-.35-.78-.78 0-.43.35-.78.78-.78zm6.43 8.83h-6.57c-.43 0-.78-.35-.78-.78 0-.43.35-.78.78-.78h6.57c.43 0 .78.35.78.78 0 .43-.35.78-.78.78z" />
            </svg>
            <span>Parenting Blog</span>
          </a>
        </div>

        <div className="hidden md:block" aria-hidden />
      </div>
    </footer>
  );
}
