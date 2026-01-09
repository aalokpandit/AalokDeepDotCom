import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

interface RootLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared root layout wrapper for all apps
 * Provides consistent structure: Header (top) → Main content (center) → Footer (bottom)
 * Sets cream background (#FDFBF7) and slate text theme across apps
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render in main section
 */
export function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="bg-[#FDFBF7]">
      <head />
      <body className="text-slate-800 overflow-x-hidden">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center overflow-hidden">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
