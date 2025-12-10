import React from 'react';
import { Folder, GitBranch, Clock, MoreVertical, Play } from 'lucide-react';
import { motion } from 'framer-motion';
interface ProjectCardProps {
  title: string;
  description: string;
  language: string;
  lastEdited: string;
  branch: string;
  status: 'active' | 'archived' | 'building';
}
export function ProjectCard({
  title,
  description,
  language,
  lastEdited,
  branch,
  status
}: ProjectCardProps) {
  return <motion.div whileHover={{
    y: -2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
  }} className="bg-charcoal-light border border-charcoal-lighter rounded-lg p-5 hover:border-amber/50 transition-colors group relative overflow-hidden">
      {/* Active Indicator Strip */}
      {status === 'active' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber" />}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded bg-charcoal-lighter ${status === 'active' ? 'text-amber' : 'text-theme-muted'}`}>
            <Folder size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-theme-text group-hover:text-amber transition-colors">
              {title}
            </h3>
            <span className="text-xs text-theme-muted font-mono">{language}</span>
          </div>
        </div>
        <button title="More options" className="text-theme-muted hover:text-theme-text p-1 rounded hover:bg-charcoal-lighter transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>

      <p className="text-sm text-theme-muted mb-6 line-clamp-2 h-10">
        {description}
      </p>

      <div className="flex items-center justify-between text-xs text-theme-muted font-mono border-t border-charcoal-lighter pt-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <GitBranch size={12} />
            {branch}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} />
            {lastEdited}
          </span>
        </div>

        <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-amber text-charcoal-dark px-3 py-1 rounded font-bold flex items-center gap-1 hover:bg-amber-dim">
          <Play size={10} fill="currentColor" />
          OPEN
        </button>
      </div>
    </motion.div>;
}