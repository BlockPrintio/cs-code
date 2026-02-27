import React, { useState } from 'react';
import { Package, Plus, Trash2, Download, Search } from 'lucide-react';

export interface Dependency {
  name: string;
  version: string;
  type: 'dependencies' | 'devDependencies';
}

interface DependencyManagerProps {
  dependencies: Dependency[];
  onAdd?: (name: string, version: string, type: 'dependencies' | 'devDependencies') => void;
  onRemove?: (name: string) => void;
  onInstall?: () => void;
}

export function DependencyManager({ dependencies, onAdd, onRemove, onInstall }: DependencyManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newPkg, setNewPkg] = useState({ name: '', version: 'latest', type: 'dependencies' as const });
  const [searchQuery, setSearchQuery] = useState('');

  const handleAdd = () => {
    if (newPkg.name.trim() && onAdd) {
      onAdd(newPkg.name.trim(), newPkg.version.trim(), newPkg.type);
      setNewPkg({ name: '', version: 'latest', type: 'dependencies' });
      setIsAdding(false);
    }
  };

  const filteredDeps = dependencies.filter(dep => 
    dep.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const prodDeps = filteredDeps.filter(d => d.type === 'dependencies');
  const devDeps = filteredDeps.filter(d => d.type === 'devDependencies');

  return (
    <div className="h-full flex flex-col bg-charcoal">
      <div className="flex items-center justify-between px-3 py-2 border-b border-charcoal-lighter bg-charcoal-darker">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-slate-200">Dependencies</span>
          <span className="text-xs text-slate-500">({dependencies.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onInstall}
            className="p-1.5 rounded hover:bg-charcoal-lighter transition-colors"
            title="Install Dependencies"
          >
            <Download className="w-4 h-4 text-green-400" />
          </button>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="p-1.5 rounded hover:bg-charcoal-lighter transition-colors"
            title="Add Dependency"
          >
            <Plus className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="px-3 py-3 border-b border-charcoal-lighter bg-charcoal-darker space-y-2">
          <input
            type="text"
            placeholder="Package name (e.g., lodash)"
            value={newPkg.name}
            onChange={(e) => setNewPkg(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 bg-charcoal border border-charcoal-lighter rounded text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            autoFocus
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Version"
              value={newPkg.version}
              onChange={(e) => setNewPkg(prev => ({ ...prev, version: e.target.value }))}
              className="flex-1 px-3 py-2 bg-charcoal border border-charcoal-lighter rounded text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <select
              value={newPkg.type}
              onChange={(e) => setNewPkg(prev => ({ ...prev, type: e.target.value as any }))}
              className="px-3 py-2 bg-charcoal border border-charcoal-lighter rounded text-sm text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="dependencies">Prod</option>
              <option value="devDependencies">Dev</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-sm font-medium transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setIsAdding(false)}
              className="flex-1 px-3 py-2 bg-charcoal-lighter hover:bg-slate-700 text-slate-300 rounded text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="px-3 py-2 border-b border-charcoal-lighter">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search packages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-charcoal-darker border border-charcoal-lighter rounded text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        {prodDeps.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-slate-400 uppercase mb-2">
              Production
            </div>
            {prodDeps.map((dep) => (
              <div
                key={dep.name}
                className="flex items-center justify-between py-2 px-2 rounded hover:bg-charcoal-lighter group"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-200 font-medium truncate">
                    {dep.name}
                  </div>
                  <div className="text-xs text-slate-500">{dep.version}</div>
                </div>
                <button
                  onClick={() => onRemove?.(dep.name)}
                  className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-900/20 transition-all"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {devDeps.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase mb-2">
              Development
            </div>
            {devDeps.map((dep) => (
              <div
                key={dep.name}
                className="flex items-center justify-between py-2 px-2 rounded hover:bg-charcoal-lighter group"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-slate-200 font-medium truncate">
                    {dep.name}
                  </div>
                  <div className="text-xs text-slate-500">{dep.version}</div>
                </div>
                <button
                  onClick={() => onRemove?.(dep.name)}
                  className="p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-red-900/20 transition-all"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}

        {filteredDeps.length === 0 && (
          <div className="text-center py-8 text-slate-500 text-sm">
            {searchQuery ? 'No matching packages' : 'No dependencies yet'}
          </div>
        )}
      </div>
    </div>
  );
}
