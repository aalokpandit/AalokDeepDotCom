'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/**
 * Collapsible section component with animated expand/collapse
 * Used for project detail sections (About, Progress Log, Links)
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Section heading text
 * @param {React.ReactNode} props.children - Content to show when expanded
 * @param {boolean} [props.defaultOpen=false] - Initial expanded state
 */
export default function Collapsible({
  title,
  children,
  defaultOpen = false,
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <h3 className="text-lg font-semibold text-slate-900">
          {title}
        </h3>
        <ChevronDown
          size={20}
          className={`text-slate-600 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-white border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  );
}
