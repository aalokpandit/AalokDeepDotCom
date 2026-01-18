import { Suspense } from 'react';
import { ComingSoon } from '@aalokdeep/ui';

export const metadata = {
  title: "Resume | Aalok Deep Pandit",
  description: "Aalok's resume is coming soon.",
};

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <ComingSoon homePath="https://aalokdeep.com" />
    </Suspense>
  );
}
