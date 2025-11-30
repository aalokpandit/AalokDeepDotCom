import Link from 'next/link';
import { NotFound } from '@aalokdeep/ui';

export default function CustomNotFound() {
  return (
    <NotFound
      title="404"
      message="Oops! The page you are looking for does not exist."
    >
      <Link 
        href="/" 
        className="inline-block px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors duration-300"
      >
        Return to Homepage
      </Link>
    </NotFound>
  );
}
