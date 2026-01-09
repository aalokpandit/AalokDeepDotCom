import type { Metadata } from 'next';
import { RootLayout as SharedRootLayout } from '@aalokdeep/ui';
import './globals.css';

export const metadata: Metadata = {
  title: 'Journal | Aalok Deep Pandit',
  description: 'Long-form journal entries and updates from Aalok Deep Pandit.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <SharedRootLayout>{children}</SharedRootLayout>;
}
