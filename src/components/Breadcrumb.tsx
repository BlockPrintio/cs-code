import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  path: string[];
}

export function Breadcrumb({ path }: BreadcrumbProps) {
  if (!path || path.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 px-4 py-2 text-xs text-gray-400 bg-charcoal-dark border-b border-charcoal-lighter font-mono">
      {path.map((segment, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight size={14} className="text-gray-500" />}
          <span className={index === path.length - 1 ? 'text-gray-200 font-semibold' : 'text-gray-500'}>
            {segment}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}
