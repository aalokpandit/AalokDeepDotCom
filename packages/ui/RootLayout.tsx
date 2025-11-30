import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="bg-[#FDFBF7]">
      <head />
      <body className="text-slate-800">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
