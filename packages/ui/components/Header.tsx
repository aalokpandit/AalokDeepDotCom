import React from 'react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-slate-800 hover:text-blue-600 transition-colors">
              Aalok Deep Pandit
            </Link>
          </div>
          <div className="text-sm text-slate-500">
            {/* Navigation links will go here */}
            <Link href="/" className="hover:text-slate-800 transition-colors">
              Home
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
