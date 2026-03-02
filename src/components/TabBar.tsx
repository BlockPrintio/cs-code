import React from 'react';
import { X, Circle } from 'lucide-react';
import { FileNode } from '../types';

export interface OpenTab {
  id: string;
  file: FileNode;
  unsaved?: boolean;
}

interface TabBarProps {
  tabs: OpenTab[];
  activeFileId: string | null;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
}

export function TabBar({ tabs, activeFileId, onSelectTab, onCloseTab }: TabBarProps) {
  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.tsx') || filename.endsWith('.ts')) {
      return <span className="w-1.5 h-1.5 rounded-full bg-terminal-blue inline-block mr-1.5" />;
    }
    if (filename.endsWith('.css') || filename.endsWith('.scss')) {
      return <span className="w-1.5 h-1.5 rounded-full bg-terminal-purple inline-block mr-1.5" />;
    }
    if (filename.endsWith('.json')) {
      return <span className="w-1.5 h-1.5 rounded-full bg-terminal-yellow inline-block mr-1.5" />;
    }
    if (filename.endsWith('.jsx') || filename.endsWith('.js')) {
      return <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block mr-1.5" />;
    }
    return <span className="w-1.5 h-1.5 rounded-full bg-gray-500 inline-block mr-1.5" />;
  };

  return (
    <div className="flex items-center bg-charcoal-dark border-b border-charcoal-lighter overflow-x-auto overflow-y-hidden no-scrollbar h-10 group/tabbar">
      {tabs.length === 0 ? (
        <div className="px-3 py-2 text-xs text-gray-500">No files open</div>
      ) : (
        tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              flex items-center gap-2 px-3 py-2 text-xs font-mono cursor-pointer 
              border-r border-charcoal-lighter/30 min-w-fit max-w-[220px] relative h-10 group/tab
              transition-all duration-150 shrink-0
              ${
                activeFileId === tab.id
                  ? 'bg-charcoal text-gray-100 border-b-2 border-b-amber shadow-sm'
                  : 'bg-charcoal-dark text-gray-500 hover:text-gray-300 hover:bg-charcoal-lighter/40'
              }
            `}
            onClick={() => onSelectTab(tab.id)}
          >
            {/* File Icon */}
            <div className="flex-shrink-0">
              {getFileIcon(tab.file.name)}
            </div>

            {/* File Name */}
            <span className="truncate flex-1 font-medium">{tab.file.name}</span>

            {/* Unsaved Indicator or Close Button */}
            <div className="flex-shrink-0 flex items-center justify-center w-4 h-4 ml-1">
              {tab.unsaved ? (
                <Circle
                  size={8}
                  className="text-amber fill-current"
                  strokeWidth={3}
                />
              ) : null}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`
                  flex items-center justify-center w-4 h-4 rounded hover:bg-charcoal-lighter/50
                  transition-all duration-100
                  ${tab.unsaved ? 'invisible group-hover/tab:visible' : 'visible'}
                  text-gray-400 hover:text-gray-200
                `}
              >
                <X size={12} strokeWidth={2} />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Empty space to the right */}
      <div className="flex-1 bg-charcoal-dark border-b border-charcoal-lighter/30" />
    </div>
  );
}