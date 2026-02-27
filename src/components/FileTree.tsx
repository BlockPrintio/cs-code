import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen, FileJson, FileType, Files } from 'lucide-react';
import { FileNode } from '../types';

interface FileTreeProps {
  files: FileNode[];
  activeFileId: string | null;
  onSelectFile: (file: FileNode) => void;
}

export function FileTree({ files, activeFileId, onSelectFile }: FileTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['src', 'components']));

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  const getFileIcon = (name: string, type: 'file' | 'folder', isOpen: boolean) => {
    if (type === 'folder') {
      return isOpen ? <FolderOpen size={14} className="text-amber" /> : <Folder size={14} className="text-amber/70" />;
    }
    if (name.endsWith('tsx') || name.endsWith('ts')) return <FileCode size={14} className="text-terminal-blue" />;
    if (name.endsWith('css')) return <FileType size={14} className="text-terminal-purple" />;
    if (name.endsWith('json')) return <FileJson size={14} className="text-terminal-yellow" />;
    return <FileType size={14} className="text-gray-500" />;
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expanded.has(node.id);
    const isActive = activeFileId === node.id;
    return <div key={node.id}>
        <div className={`flex items-center gap-1.5 py-1 px-2 cursor-pointer select-none text-sm transition-colors ${isActive ? 'bg-charcoal bg-opacity-80 text-white border-l-2 border-amber' : 'text-gray-400 hover:text-gray-200 hover:bg-charcoal-lighter/30 border-l-2 border-transparent'}`} style={{
        paddingLeft: `${depth * 12 + 6}px`
      } as React.CSSProperties} onClick={() => {
        if (node.type === 'folder') toggleFolder(node.id);
        else onSelectFile(node);
      }}>
          <span className="opacity-70 flex-shrink-0">
            {node.type === 'folder' && (isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />)}
            {node.type === 'file' && <span className="w-3" />}
          </span>

          {getFileIcon(node.name, node.type, isExpanded)}

          <span className="font-mono text-[13px] truncate">{node.name}</span>
        </div>
        
        {node.type === 'folder' && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>;
  };

  return <div className="w-64 bg-charcoal-dark border-r border-charcoal-lighter flex flex-col h-full">
      <div className="p-3 text-xs font-bold text-gray-500 tracking-wider uppercase flex items-center gap-2 border-b border-charcoal-lighter/50">
        <Files size={16} className="text-gray-400" />
        <span>Explorer</span>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {files.map(node => renderNode(node))}
      </div>
    </div>;
}