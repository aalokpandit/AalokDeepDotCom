import { getAllBlogs } from '@/lib/blogs';
import JournalHomeClient from './JournalHomeClient';

// Server-rendered per request so crawlers/agents get fully populated HTML without a rebuild.
export const dynamic = 'force-dynamic';

export default async function JournalHome() {
  const posts = await getAllBlogs();

  return <JournalHomeClient posts={posts} />;
}
