import React from 'react';
import { X } from 'lucide-react';
interface Tab {
  id: string;
  name: string;
  active: boolean;
  unsaved?: boolean;
}
const tabs: Tab[] = [{
  id: '1',
  name: 'App.tsx',
  active: true,
  unsaved: true
}, {
  id: '2',
  name: 'index.css',
  active: false
}, {
  id: '3',
  name: 'utils.ts',
  active: false
}];
export function TabBar() {
  return <div className="flex bg-charcoal-dark border-b border-charcoal-lighter overflow-x-auto no-scrollbar h-9">
      {tabs.map(tab => <div key={tab.id} className={`
            group flex items-center gap-2 px-3 text-xs font-mono cursor-pointer border-r border-charcoal-lighter min-w-[120px] max-w-[200px] relative h-9
            ${tab.active ? 'bg-charcoal text-gray-100 border-t-2 border-amber' : 'bg-charcoal-dark text-gray-500 hover:bg-charcoal-light hover:text-gray-300'}
          `}>
          <span className="truncate flex-1">{tab.name}</span>

          <div className="flex items-center justify-center w-5 h-5 rounded hover:bg-charcoal-lighter/50 text-transparent group-hover:text-gray-400 hover:!text-gray-200 transition-all">
            {tab.unsaved ? <div className="w-2 h-2 rounded-full bg-amber group-hover:hidden" /> : null}
            <X size={12} className={tab.unsaved ? 'hidden group-hover:block' : ''} />
          </div>
        </div>)}
    </div>;
}