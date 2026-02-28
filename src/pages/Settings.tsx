import React, { useEffect, useState } from 'react';
import { Sun, Moon, Droplet, Type, Keyboard, Layout, FileCode, WrapText, ListOrdered, Map } from 'lucide-react';

const THEME_KEY = 'cside:theme';
type Theme = 'light' | 'dark' | 'tint';

function applyTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('theme-light', 'theme-dark', 'theme-tint');
  root.classList.add(`theme-${theme}`);
}

export function Settings() {
  // Theme
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY) as Theme | null;
      return (stored as Theme) ?? 'dark';
    } catch (e) {
      return 'dark';
    }
  });

  // Editor Font Size
  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const v = localStorage.getItem('cside:editorFontSize');
      return v ? Number(v) : 14;
    } catch (e) {
      return 14;
    }
  });

  // Auto Save
  const [autoSave, setAutoSave] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cside:autoSave') === '1';
    } catch (e) {
      return false;
    }
  });

  // Keybindings
  const [keybinding, setKeybinding] = useState<'default' | 'vim' | 'emacs'>(() => {
    try {
      return (localStorage.getItem('cside:keybinding') as 'default' | 'vim' | 'emacs') || 'default';
    } catch (e) {
      return 'default';
    }
  });

  // Tab Size
  const [tabSize, setTabSize] = useState<number>(() => {
    try {
      const v = localStorage.getItem('cside:tabSize');
      return v ? Number(v) : 2;
    } catch (e) {
      return 2;
    }
  });

  // Minimap
  const [minimap, setMinimap] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cside:minimap') !== '0'; // Default true
    } catch (e) {
      return true;
    }
  });

  // Line Numbers
  const [lineNumbers, setLineNumbers] = useState<'on' | 'off' | 'relative'>(() => {
    try {
      return (localStorage.getItem('cside:lineNumbers') as 'on' | 'off' | 'relative') || 'on';
    } catch (e) {
      return 'on';
    }
  });

  // Word Wrap
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>(() => {
    try {
      return (localStorage.getItem('cside:wordWrap') as 'on' | 'off') || 'off';
    } catch (e) {
      return 'off';
    }
  });


  // Effects to persist and dispatch events

  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
      window.dispatchEvent(new CustomEvent('cside:themeChange', { detail: theme }));
    } catch (e) { /* ignore */ }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('cside:editorFontSize', String(fontSize));
      window.dispatchEvent(new CustomEvent('cside:editorFontSizeChange', { detail: fontSize }));
    } catch (e) { /* ignore */ }
  }, [fontSize]);

  useEffect(() => {
    try {
      localStorage.setItem('cside:autoSave', autoSave ? '1' : '0');
    } catch (e) { /* ignore */ }
  }, [autoSave]);

  useEffect(() => {
    try {
      localStorage.setItem('cside:keybinding', keybinding);
      window.dispatchEvent(new CustomEvent('cside:keybindingChange', { detail: keybinding }));
    } catch (e) { /* ignore */ }
  }, [keybinding]);

  useEffect(() => {
    try {
      localStorage.setItem('cside:tabSize', String(tabSize));
      window.dispatchEvent(new CustomEvent('cside:tabSizeChange', { detail: tabSize }));
    } catch (e) { /* ignore */ }
  }, [tabSize]);

  useEffect(() => {
    try {
      localStorage.setItem('cside:minimap', minimap ? '1' : '0');
      window.dispatchEvent(new CustomEvent('cside:minimapChange', { detail: minimap }));
    } catch (e) { /* ignore */ }
  }, [minimap]);

  useEffect(() => {
    try {
      localStorage.setItem('cside:lineNumbers', lineNumbers);
      window.dispatchEvent(new CustomEvent('cside:lineNumbersChange', { detail: lineNumbers }));
    } catch (e) { /* ignore */ }
  }, [lineNumbers]);

  useEffect(() => {
    try {
      localStorage.setItem('cside:wordWrap', wordWrap);
      window.dispatchEvent(new CustomEvent('cside:wordWrapChange', { detail: wordWrap }));
    } catch (e) { /* ignore */ }
  }, [wordWrap]);


  return (
    <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto text-theme-text">
      <header className="mb-8 border-b border-charcoal-light pb-4">
        <h1 className="text-3xl font-bold text-theme-text flex items-center gap-3">
          <SettingsIcon className="text-amber" /> Settings
        </h1>
        <p className="text-theme-muted mt-2">Customize your development environment.</p>
      </header>

      <div className="space-y-8">
        {/* Appearance Section */}
        <section className="bg-charcoal p-6 rounded-xl border border-charcoal-light">
          <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
            <Layout size={20} className="text-blue-400" /> Appearance
          </h2>
          
          <div className="grid gap-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-theme-text">Theme</label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    theme === 'light' ? 'border-amber bg-amber/20 text-amber' : 'border-charcoal-light bg-charcoal hover:border-gray-500'
                  }`}
                >
                  <Sun size={24} />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    theme === 'dark' ? 'border-amber bg-amber/20 text-amber' : 'border-charcoal-light bg-charcoal hover:border-gray-500'
                  }`}
                >
                  <Moon size={24} />
                  <span className="text-sm">Dark</span>
                </button>
                <button
                  onClick={() => setTheme('tint')}
                  className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                    theme === 'tint' ? 'border-amber bg-amber/20 text-amber' : 'border-charcoal-light bg-charcoal hover:border-gray-500'
                  }`}
                >
                  <Droplet size={24} />
                  <span className="text-sm">Tint</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Editor Section */}
        <section className="bg-charcoal p-6 rounded-xl border border-charcoal-light">
          <h2 className="text-xl font-semibold text-theme-text mb-4 flex items-center gap-2">
            <FileCode size={20} className="text-green-400" /> Editor
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-theme-text flex items-center gap-2">
                <Type size={16} /> Font Size ({fontSize}px)
              </label>
              <input
                type="range"
                min="10"
                max="32"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-amber h-2 bg-charcoal-light rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-theme-text flex items-center gap-2">
                 <Keyboard size={16} /> Key Binding
              </label>
              <select
                value={keybinding}
                onChange={(e) => setKeybinding(e.target.value as any)}
                className="w-full p-2 bg-charcoal border border-charcoal-light rounded-lg text-theme-text focus:border-amber focus:outline-none"
              >
                <option value="default">Standard</option>
                <option value="vim">Vim</option>
                <option value="emacs">Emacs</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-theme-text flex items-center gap-2">
                Tab Size
              </label>
              <select
                value={tabSize}
                onChange={(e) => setTabSize(Number(e.target.value))}
                className="w-full p-2 bg-charcoal border border-charcoal-light rounded-lg text-theme-text focus:border-amber focus:outline-none"
              >
                <option value={2}>2 Spaces</option>
                <option value={4}>4 Spaces</option>
                <option value={8}>8 Spaces</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-theme-text flex items-center gap-2">
                <ListOrdered size={16} /> Line Numbers
              </label>
              <select
                value={lineNumbers}
                onChange={(e) => setLineNumbers(e.target.value as any)}
                className="w-full p-2 bg-charcoal border border-charcoal-light rounded-lg text-theme-text focus:border-amber focus:outline-none"
              >
                <option value="on">On</option>
                <option value="off">Off</option>
                <option value="relative">Relative</option>
              </select>
            </div>

             <div className="flex items-center justify-between p-3 bg-charcoal rounded-lg border border-charcoal-light">
              <label className="text-sm font-medium text-theme-text flex items-center gap-2 cursor-pointer" onClick={() => setMinimap(!minimap)}>
                <Map size={16} /> Minimap
              </label>
              <button
                onClick={() => setMinimap(!minimap)}
                className={`w-12 h-6 rounded-full transition-colors relative ${minimap ? 'bg-amber' : 'bg-charcoal-light'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${minimap ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-charcoal rounded-lg border border-charcoal-light">
              <label className="text-sm font-medium text-theme-text flex items-center gap-2 cursor-pointer" onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}>
                <WrapText size={16} /> Word Wrap
              </label>
              <button
                onClick={() => setWordWrap(wordWrap === 'on' ? 'off' : 'on')}
                className={`w-12 h-6 rounded-full transition-colors relative ${wordWrap === 'on' ? 'bg-amber' : 'bg-charcoal-light'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${wordWrap === 'on' ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

             <div className="flex items-center justify-between p-3 bg-charcoal rounded-lg border border-charcoal-light">
              <label className="text-sm font-medium text-theme-text flex items-center gap-2 cursor-pointer" onClick={() => setAutoSave(!autoSave)}>
                Auto Save
              </label>
              <button
                onClick={() => setAutoSave(!autoSave)}
                className={`w-12 h-6 rounded-full transition-colors relative ${autoSave ? 'bg-amber' : 'bg-charcoal-light'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autoSave ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
