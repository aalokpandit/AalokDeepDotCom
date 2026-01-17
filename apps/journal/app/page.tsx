'use client';

import { useEffect, useMemo, useState } from 'react';
import { TagChips } from '@/components/TagChips';
import { PostList } from '@/components/PostList';
import type { BlogListItem } from '@aalokdeep/types';
import { getAllBlogs } from '@/lib/blogs';

export default function JournalHome() {
  const [posts, setPosts] = useState<BlogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllBlogs();
        setPosts(data);
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => post.tags?.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) return posts;
    return posts.filter((post) => {
      if (!post.tags || post.tags.length === 0) return false;
      return post.tags.some((tag) => selectedTags.includes(tag));
    });
  }, [posts, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((t) => t !== tag)
        : [...current, tag]
    );
  };

  return (
    <main className="bg-[#FDFBF7]">
      <div className="mx-auto max-w-6xl px-4 py-12 text-slate-800 md:py-16">
        <header className="mb-12 space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 md:text-5xl">
            The Journal
          </h1>
          <p className="max-w-3xl text-lg text-slate-700">
            Welcome to the journal. This is a collection of essays, reflections, and long‑form thoughts
             that trace the ideas behind my work and life. Each entry captures a moment of curiosity, a
              question I’m exploring, or a story worth sitting with. Browse the posts below to dive into
               the thinking, context, and narratives that shape my projects and perspectives.
          </p>
        </header>

        <section className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Latest posts</h2>
            {selectedTags.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedTags([])}
                className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Clear tags
              </button>
            )}
          </div>
          <TagChips tags={availableTags} selectedTags={selectedTags} onToggle={toggleTag} />
        </section>

        {loading ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-slate-600">
            Loading posts...
          </div>
        ) : (
          <PostList posts={filteredPosts} />
        )}
      </div>
    </main>
  );
}
