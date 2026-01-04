'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@aalokdeep/types';

export type ProjectCardData = Pick<Project, 'id' | 'title' | 'description' | 'heroImage'>;

interface ProjectCardProps {
  project: ProjectCardData;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`}>
      <div className="group h-full bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border border-slate-200">
        {/* Image Container */}
        <div className="relative h-48 bg-slate-200 overflow-hidden">
          <Image
            src={project.heroImage.url}
            alt={project.heroImage.alt}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content Container */}
        <div className="p-6 flex flex-col h-full">
          <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-600 text-sm flex-grow mb-4 line-clamp-3">
            {project.description}
          </p>
          <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all duration-300">
            <span>View Details</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
