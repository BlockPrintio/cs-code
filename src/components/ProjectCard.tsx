import React, { useState } from 'react';
import { Folder, GitBranch, Clock, Download, Github, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  language: string;
  lastEdited: string;
  branch: string;
  status: 'active' | 'archived' | 'building';
  onOpen?: (projectId: string) => void;
  onDownload?: (projectId: string) => void;
  onPushGithub?: (projectId: string) => void;
  onRenameProject?: (projectId: string, newTitle: string) => void;
}
export function ProjectCard({
  id,
  title,
  description,
  language,
  lastEdited,
  branch,
  status,
  onOpen,
  onDownload,
  onPushGithub,
  onRenameProject
}: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  return <motion.div whileHover={{
    y: -2,
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
  }} className="bg-charcoal-light border border-charcoal-lighter rounded-lg p-5 hover:border-amber/50 transition-colors group relative overflow-hidden">
      {/* Active Indicator Strip */}
      {status === 'active' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber" />}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className={`p-2 rounded bg-charcoal-lighter ${status === 'active' ? 'text-amber' : 'text-theme-muted'}`}>
            <Folder size={20} />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={() => {
                  if (editedTitle.trim()) {
                    onRenameProject?.(id, editedTitle);
                  } else {
                    setEditedTitle(title);
                  }
                  setIsEditing(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (editedTitle.trim()) {
                      onRenameProject?.(id, editedTitle);
                    } else {
                      setEditedTitle(title);
                    }
                    setIsEditing(false);
                  } else if (e.key === 'Escape') {
                    setEditedTitle(title);
                    setIsEditing(false);
                  }
                }}
                autoFocus
                className="w-full bg-charcoal-lighter border border-amber rounded px-2 py-1 text-theme-text font-semibold focus:outline-none focus:ring-1 focus:ring-amber"
              />
            ) : (
              <h3
                onClick={() => setIsEditing(true)}
                className="font-semibold text-theme-text group-hover:text-amber transition-colors cursor-pointer hover:bg-charcoal-lighter/30 rounded px-1 py-0.5"
              >
                {title}
              </h3>
            )}
            <span className="text-xs text-theme-muted font-mono">{language}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDownload?.(id)}
            title="Download code"
            className="text-theme-muted hover:text-terminal-green p-1 rounded hover:bg-charcoal-lighter transition-colors"
          >
            <Download size={16} />
          </button>
          <button
            onClick={() => onPushGithub?.(id)}
            title="Push to GitHub"
            className="text-theme-muted hover:text-terminal-blue p-1 rounded hover:bg-charcoal-lighter transition-colors"
          >
            <Github size={16} />
          </button>
        </div>
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

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpen?.(id);
          }}
          className="bg-amber hover:bg-amber-dim text-charcoal-dark font-bold py-1 px-2 rounded text-xs flex items-center gap-1 transition-colors whitespace-nowrap"
        >
          OPEN <ArrowRight size={12} />
        </button>
      </div>
    </motion.div>;
}