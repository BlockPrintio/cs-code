import { LayoutDashboard, Code, LayoutTemplate, TestTube, Wallet, Rocket, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

type View = 'dashboard' | 'editor' | 'templates' | 'testing' | 'wallet' | 'deployment' | 'settings';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
}
export function Sidebar({
  currentView,
  onChangeView
}: SidebarProps) {
  const navItems = [{
    id: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  }, {
    id: 'editor',
    icon: Code,
    label: 'Code Editor'
  }, {
    id: 'templates',
    icon: LayoutTemplate,
    label: 'Templates'
  }, {
    id: 'testing',
    icon: TestTube,
    label: 'Testing'
  }, {
    id: 'wallet',
    icon: Wallet,
    label: 'Wallet'
  }, {
    id: 'deployment',
    icon: Rocket,
    label: 'Deploy'
  }, {
    id: 'settings',
    icon: Settings,
    label: 'Settings'
  }] as const;
  return <aside className="w-16 bg-charcoal-dark border-r border-charcoal-lighter flex flex-col items-center py-4 z-20">
      <div className="mb-8 p-2 bg-amber/10 rounded-lg text-amber">
        <div className="w-6 h-6 border-2 border-amber rounded-sm flex items-center justify-center font-mono font-bold text-xs">
          CS
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-4 w-full px-2">
        {navItems.map(item => {
        const isActive = currentView === item.id;
        return <button key={item.id} onClick={() => onChangeView(item.id)} className={`relative group p-3 rounded-lg transition-all duration-200 flex justify-center ${isActive ? 'text-amber bg-amber/20' : 'text-gray-500 hover:text-gray-300 hover:bg-charcoal-lighter'}`} aria-label={item.label}>
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />

              {/* Active Indicator */}
              {isActive && <motion.div layoutId="active-nav" className="absolute left-0 top-2 bottom-2 w-1 bg-amber rounded-r-full" />}

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-2 py-1 bg-charcoal-lighter border border-charcoal-light text-xs text-gray-200 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                {item.label}
              </div>
            </button>;
      })}
      </nav>

      <div className="flex flex-col gap-4 w-full px-2 mt-auto">

        <button title="Log Out" className="p-3 text-gray-500 hover:text-terminal-red hover:bg-terminal-red/10 rounded-lg transition-colors flex justify-center">
          <LogOut size={20} />
        </button>
      </div>
    </aside>;
}