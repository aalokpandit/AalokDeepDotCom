import type { Project } from '@aalokdeep/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';

/**
 * Fetch all projects (card fields only)
 * Used for project listing page
 */
export async function getAllProjects(): Promise<
  Pick<Project, 'id' | 'title' | 'description' | 'heroImage'>[]
> {
  try {
    const response = await fetch(`${API_BASE}/api/projects`, {
      next: { revalidate: 3600 }, // Cache for 1 hour (matches API cache-control)
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}

/**
 * Fetch a single project by ID (full details)
 * Used for project detail page
 */
export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const response = await fetch(`${API_BASE}/api/projects/${id}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
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
    console.error(`Failed to fetch project ${id}:`, error);
    return null;
  }
}
