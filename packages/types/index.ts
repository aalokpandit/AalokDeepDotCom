/**
 * @aalokdeep/types
 * Shared TypeScript interfaces for API, database, and UI layers
 */

/**
 * Progress log entry for a project
 */
export interface ProgressLogEntry {
  date: string; // ISO date string (YYYY-MM-DD)
  description: string;
}

/**
 * External link associated with a project
 */
export interface ProjectLink {
  title: string;
  url: string;
}

/**
 * Image metadata for project details page
 */
export interface ProjectImage {
  url: string; // relative path (e.g., "/images/project-1-screenshot.jpg")
  alt: string;
  caption?: string;
  type?: "screenshot" | "diagram" | "diagram" | "other";
}

/**
 * Hero image for project card
 */
export interface HeroImage {
  url: string; // relative path (e.g., "/images/project-1.jpg")
  alt: string;
}

/**
 * Core project data model
 */
export interface Project {
  id: string; // Cosmos document id
  title: string;
  description: string; // Brief description for card
  heroImage: HeroImage;
  detailedDescription: string;
  progressLog: ProgressLogEntry[];
  links: ProjectLink[];
  detailImages?: ProjectImage[]; // Optional collection for details page
}

/**
 * API response wrapper for success
 */
export interface ApiResponse<T> {
  success: true;
  data: T;
}

/**
 * API error response
 */
export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * API response type (success or error)
 */
export type ApiResponseType<T> = ApiResponse<T> | ApiError;

/**
 * Request body for creating a project
 */
export interface CreateProjectRequest {
  title: string;
  description: string;
  heroImage: HeroImage;
  detailedDescription: string;
  progressLog?: ProgressLogEntry[];
  links?: ProjectLink[];
  detailImages?: ProjectImage[];
}

/**
 * Request body for updating project
 */
export interface UpdateProjectRequest
  extends Partial<CreateProjectRequest> {
  id: string;
}

/**
 * Request body for adding a progress log entry
 */
export interface AddProgressLogRequest {
  projectId: string;
  date: string; // ISO date string
  description: string;
}

/**
 * Request body for updating a progress log entry
 */
export interface UpdateProgressLogRequest {
  projectId: string;
  date: string; // ISO date string to identify entry
  description: string;
}

/**
 * Response from image upload token generation endpoint
 */
export interface ImageUploadTokenResponse {
  sasUrl: string;  // Full URL with SAS token for direct upload to Blob
  blobUrl: string; // Public URL (without SAS) to store in Cosmos DB
}

/**
 * Cosmos DB document response (includes internal fields for reference)
 * Not exported to API responses, kept internal
 */
export interface CosmosDocument {
  _id?: string;
  _rid?: string;
  _ts?: number;
  _etag?: string;
}
