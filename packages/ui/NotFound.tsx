import React from 'react';

interface NotFoundProps {
  title: string;
  message: string;
  children: React.ReactNode;
}

export function NotFound({ title, message, children }: NotFoundProps) {
  return (
    <section className="min-h-[60vh] flex items-center justify-center text-center p-6">
      <div className="space-y-6">
        <h1 className="text-6xl font-serif font-bold text-slate-900">{title}</h1>
        <p className="text-xl text-slate-600">{message}</p>
        <div className="pt-4">
          {children}
        </div>
      </div>
    </section>
  );
}
