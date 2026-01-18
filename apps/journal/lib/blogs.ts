import type { Blog, BlogListItem } from '@aalokdeep/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';

export async function getAllBlogs(): Promise<BlogListItem[]> {
  try {
    const response = await fetch(`${API_BASE}/api/blogs`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch blogs:', error);
    return [];
  }
}

export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const response = await fetch(`${API_BASE}/api/blogs/${id}`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error(`Failed to fetch blog ${id}:`, error);
    return null;
  }
}
