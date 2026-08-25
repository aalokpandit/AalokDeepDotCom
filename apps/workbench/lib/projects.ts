import type { Project } from '@aalokdeep/types';
import type { ProjectCardData } from '@/components/ProjectCard';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:7071';

export async function getAllProjects(): Promise<ProjectCardData[]> {
  try {
    const response = await fetch(`${API_BASE}/api/projects`, {
      next: { revalidate: 3600 },
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

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const response = await fetch(`${API_BASE}/api/projects/${id}`, {
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
    console.error(`Failed to fetch project ${id}:`, error);
    return null;
  }
}
