'use client';

import { Suspense } from 'react';
import ComingSoon from '@aalokdeep/ui/ComingSoon';
import NotFound from '@aalokdeep/ui/NotFound';

export const metadata = {
  title: "Resume | Aalok Deep Pandit",
  description: "Aalok's resume is coming soon.",
};

export default function ResumePage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading...</div>}>
      <ComingSoon featureName="Resume">
        <NotFound>
          <p className="text-slate-600 mb-6">
            I'm putting together my resume. Check back soon!
          </p>
        </NotFound>
      </ComingSoon>
    </Suspense>
  );
}
