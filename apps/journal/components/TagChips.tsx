'use client';

import React from 'react';

interface TagChipsProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
}

export function TagChips({ tags, selectedTags, onToggle }: TagChipsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className={`rounded-full border px-3 py-1 text-sm transition-colors ${
              isSelected
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
