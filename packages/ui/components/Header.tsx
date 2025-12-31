"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/coming-soon?feature=The+Workbench', label: 'Workbench' },
  { href: '/coming-soon?feature=The+Journal', label: 'Journal' },
  { href: '/coming-soon?feature=The+Gallery', label: 'Gallery' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl text-slate-800 hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
            Aalok Deep Pandit
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-600">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                {label}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-slate-600 hover:text-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            aria-label="Toggle navigation menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-2 text-sm text-slate-600">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block px-2 py-2 rounded-md hover:bg-slate-100 hover:text-blue-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
