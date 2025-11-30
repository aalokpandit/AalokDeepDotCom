import React from 'react';

interface RootLayoutProps {
  children: React.ReactNode;
}

export function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        {/* The favicon configuration will live here permanently */}
      </head>
      <body>{children}</body>
    </html>
  );
}
