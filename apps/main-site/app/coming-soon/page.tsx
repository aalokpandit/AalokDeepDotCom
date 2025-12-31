import { Suspense } from 'react';
import { ComingSoon } from '@aalokdeep/ui';

function ComingSoonContent() {
  return <ComingSoon homePath="/" />;
}

export default function ComingSoonPage() {
  return (
    <Suspense fallback={null}>
      <ComingSoonContent />
    </Suspense>
  );
}
