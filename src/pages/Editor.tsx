import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import Split from 'react-split';
import { FileTree } from '../components/FileTree';
import { TabBar } from '../components/TabBar';
import { Breadcrumb } from '../components/Breadcrumb';
import { SandboxPreview, ConsoleLog } from '../components/SandboxPreview';
import { ConsoleOutput } from '../components/ConsoleOutput';
import { DependencyManager, Dependency } from '../components/DependencyManager';
import { CardanoTools } from '../components/CardanoTools';
import { TerminalBar } from '../components/TerminalBar';
import { Project, FileNode } from '../types';
import { Layers, Package, Hammer } from 'lucide-react';

interface EditorPageProps {
  project?: Project;
}

export function EditorPage({ project }: EditorPageProps) {
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [rightPanel, setRightPanel] = useState<'preview' | 'dependencies' | 'cardano'>('preview');
  const [bottomPanel, setBottomPanel] = useState<'console' | 'terminal'>('console');
  const [dependencies, setDependencies] = useState<Dependency[]>([
    { name: '@lucid-evolution/lucid', version: 'latest', type: 'dependencies' },
    { name: '@meshsdk/core', version: 'latest', type: 'dependencies' },
  ]);

  // Set initial active file when project loads
  useEffect(() => {
    if (project && project.files.length > 0 && !activeFileId) {
      // Find first file (bfs or dfs)
      const findFirstFile = (nodes: FileNode[]): FileNode | null => {
        for (const node of nodes) {
          if (node.type === 'file') return node;
          if (node.children) {
            const found = findFirstFile(node.children);
            if (found) return found;
          }
        }
        return null;
      };
      const first = findFirstFile(project.files);
      if (first) setActiveFileId(first.id);
    }
  }, [project, activeFileId]);

  const findFileById = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFileById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const getBreadcrumbPath = (nodes: FileNode[], id: string, path: string[] = []): string[] => {
    for (const node of nodes) {
      if (node.id === id) {
        return [...path, node.name];
      }
      if (node.children) {
        const found = getBreadcrumbPath(node.children, id, [...path, node.name]);
        if (found.length > path.length) return found;
      }
    }
    return path;
  };

  const activeFile = project && activeFileId ? findFileById(project.files, activeFileId) : null;
  const breadcrumbPath = project && activeFileId ? getBreadcrumbPath(project.files, activeFileId) : [];
  const code = activeFile?.content || '// Select a file to view its content';

  // Convert file tree to files object for SandboxPreview
  const getFilesObject = (nodes: FileNode[], basePath = ''): Record<string, string> => {
    const files: Record<string, string> = {};
    nodes.forEach(node => {
      const path = basePath ? `${basePath}/${node.name}` : node.name;
      if (node.type === 'file' && node.content) {
        files[path] = node.content;
      }
      if (node.children) {
        Object.assign(files, getFilesObject(node.children, path));
      }
    });
    return files;
  };

  const filesForPreview = project ? getFilesObject(project.files) : {};

  const handleAddDependency = (name: string, version: string, type: 'dependencies' | 'devDependencies') => {
    setDependencies(prev => [...prev, { name, version, type }]);
  };

  const handleRemoveDependency = (name: string) => {
    setDependencies(prev => prev.filter(d => d.name !== name));
  };

  const handleInstallDependencies = () => {
    console.log('Installing dependencies...', dependencies);
    // In a real implementation, this would trigger npm install
  };

  const handleGenerateWallet = () => {
    console.log('Generating test wallet...');
    // Implementation for generating Cardano test wallet
  };

  const handleCreateContract = () => {
    console.log('Creating smart contract...');
  };

  const handleValidateMetadata = () => {
    console.log('Validating metadata...');
  };

  const handleClearConsole = () => {
    setConsoleLogs([]);
  };

  const [fontSize, setFontSize] = useState<number>(() => {
    try {
      const v = localStorage.getItem('cside:editorFontSize');
      return v ? Number(v) : 14;
    } catch (e) {
      return 14;
    }
  });

  useEffect(() => {
    const handler = (e: any) => {
      if (typeof e?.detail === 'number') setFontSize(Number(e.detail));
    };
    window.addEventListener('cside:editorFontSizeChange', handler as EventListener);
    return () => window.removeEventListener('cside:editorFontSizeChange', handler as EventListener);
  }, []);

  // Keybinding (default | vim | emacs)
  const [keybinding, setKeybinding] = useState<'default' | 'vim' | 'emacs'>(() => {
    try {
      return (localStorage.getItem('cside:keybinding') as 'default' | 'vim' | 'emacs') || 'default';
    } catch (e) {
      return 'default';
    }
  });

  useEffect(() => {
    const handler = (e: any) => {
      if (typeof e?.detail === 'string') setKeybinding(e.detail as any);
    };
    window.addEventListener('cside:keybindingChange', handler as EventListener);
    return () => window.removeEventListener('cside:keybindingChange', handler as EventListener);
  }, []);

  // Theme change listener for Monaco
  // Monaco theme is handled directly in editor mount listeners.

  // Tab Size
  const [tabSize, setTabSize] = useState<number>(() => {
    try {
      const v = localStorage.getItem('cside:tabSize');
      return v ? Number(v) : 2;
    } catch (e) {
      return 2;
    }
  });

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) setTabSize(Number(e.detail));
    };
    window.addEventListener('cside:tabSizeChange', handler as EventListener);
    return () => window.removeEventListener('cside:tabSizeChange', handler as EventListener);
  }, []);

  // Minimap
  const [minimap, setMinimap] = useState<boolean>(() => {
    try {
      return localStorage.getItem('cside:minimap') !== '0';
    } catch (e) {
      return true;
    }
  });

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail !== undefined) setMinimap(e.detail);
    };
    window.addEventListener('cside:minimapChange', handler as EventListener);
    return () => window.removeEventListener('cside:minimapChange', handler as EventListener);
  }, []);

  // Line Numbers
  const [lineNumbers, setLineNumbers] = useState<'on' | 'off' | 'relative'>(() => {
    try {
      return (localStorage.getItem('cside:lineNumbers') as 'on' | 'off' | 'relative') || 'on';
    } catch (e) {
      return 'on';
    }
  });

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) setLineNumbers(e.detail);
    };
    window.addEventListener('cside:lineNumbersChange', handler as EventListener);
    return () => window.removeEventListener('cside:lineNumbersChange', handler as EventListener);
  }, []);

  // Word Wrap
  const [wordWrap, setWordWrap] = useState<'on' | 'off'>(() => {
    try {
      return (localStorage.getItem('cside:wordWrap') as 'on' | 'off') || 'off';
    } catch (e) {
      return 'off';
    }
  });

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail) setWordWrap(e.detail);
    };
    window.addEventListener('cside:wordWrapChange', handler as EventListener);
    return () => window.removeEventListener('cside:wordWrapChange', handler as EventListener);
  }, []);


  const handleEditorDidMount = (editor: any, monaco: any) => {
    // Setup Monaco themes for light and tint
    try {
      monaco.editor.defineTheme('cs-light', {
        base: 'vs',
        inherit: true,
        rules: [{ token: 'comment', foreground: '64748b', fontStyle: 'italic' }, { token: 'keyword', foreground: '7e22ce' }, { token: 'string', foreground: '15803d' }],
        colors: {
          'editor.background': '#ffffff',
          'editor.foreground': '#0f172a',
          'editor.lineHighlightBackground': '#f1f5f9', // Slate 100
          'editorCursor.foreground': '#7e22ce',
          'editor.selectionBackground': '#cbd5e1', // Slate 300
          'editor.selectionHighlightBackground': '#e2e8f0' // Slate 200
        }
      });
      monaco.editor.defineTheme('cs-tint', {
        base: 'vs-dark',
        inherit: true,
        rules: [{ token: 'comment', foreground: 'a5b4fc', fontStyle: 'italic' }, { token: 'keyword', foreground: 'c084fc' }, { token: 'string', foreground: '6ee7b7' }],
        colors: {
          'editor.background': '#1e1b4b',
          'editor.foreground': '#e0e7ff',
          'editor.lineHighlightBackground': '#312e81', // Indigo 900
          'editorCursor.foreground': '#fcd34d',
          'editor.selectionBackground': '#4338ca', // Indigo 700
          'editor.selectionHighlightBackground': '#3730a3' // Indigo 800
        }
      });
    } catch (e) { /* ignore */ }
    // Define custom theme
    monaco.editor.defineTheme('cs-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [{
        token: 'comment',
        foreground: '94a3b8',
        fontStyle: 'italic'
      }, {
        token: 'keyword',
        foreground: 'c084fc'
      }, {
        token: 'string',
        foreground: 'fde047'
      }, {
        token: 'function',
        foreground: '4ade80'
      }, {
        token: 'number',
        foreground: 'fbbf24'
      }, {
        token: 'type',
        foreground: '60a5fa'
      }],
      colors: {
        'editor.background': '#020617',
        'editor.foreground': '#f8fafc',
        'editor.lineHighlightBackground': '#1e293b', // Slate 800
        'editorCursor.foreground': '#fbbf24',
        'editorWhitespace.foreground': '#334155',
        'editor.selectionBackground': '#334155', // Slate 700
        'editor.selectionHighlightBackground': '#475569' // Slate 600
      }
    });
    // pick initial theme for Monaco
    const chooseTheme = () => {
      const t = (localStorage.getItem('cside:theme') as string) || 'dark';
      if (t === 'light') monaco.editor.setTheme('cs-light');else if (t === 'tint') monaco.editor.setTheme('cs-tint');else monaco.editor.setTheme('cs-dark');
    };
    chooseTheme();

    // Manage keybinding modes
    let vimMode: any = null;
    let emacsDisposables: any[] = [];

    const enableVim = async () => {
      try {
        const mod = await import('monaco-vim');
        // monaco-vim exports initVimMode
        if (mod && typeof mod.initVimMode === 'function') {
          const statusNode = document.createElement('div');
          vimMode = mod.initVimMode(editor, statusNode);
        }
      } catch (e) {
        // ignore if not available
      }
    };

    const disableVim = () => {
      try {
        if (vimMode && typeof vimMode.dispose === 'function') vimMode.dispose();
        vimMode = null;
      } catch (e) { /* ignore */ }
    };

    const enableEmacs = () => {
      try {
        // basic Emacs shortcuts: C-a (start), C-e (end), C-k (kill to end)
        const add = (key: number, handler: () => void) => {
          const disposable = editor.addCommand(monaco.KeyMod.CtrlCmd | key, () => handler());
          emacsDisposables.push(disposable);
        };

        add(monaco.KeyCode.KEY_A, () => editor.trigger('keyboard', 'cursorHome', {}));
        add(monaco.KeyCode.KEY_E, () => editor.trigger('keyboard', 'cursorEnd', {}));
        add(monaco.KeyCode.KEY_K, () => {
          try {
            const model = editor.getModel();
            const pos = editor.getPosition();
            if (!model || !pos) return;
            const { lineNumber: line, column } = pos;
            const lineContent = model.getLineContent(line);
            const endColumn = lineContent.length + 1;
            const range = new monaco.Range(line, column, line, endColumn);
            const id = { major: 1, minor: 1 };
            editor.executeEdits('emacs-k', [{ range, text: '' }], [id]);
          } catch (e) { /* ignore */ }
        });
      } catch (e) { /* ignore */ }
    };

    const disableEmacs = () => {
      try {
        if (emacsDisposables.length) {
          emacsDisposables.forEach(d => editor._standaloneKeybindingService?.removeCommand && editor._standaloneKeybindingService.removeCommand(d));
        }
        emacsDisposables = [];
      } catch (e) { /* ignore */ }
    };

    // Apply initial keybinding
    if (keybinding === 'vim') {
      enableVim();
    } else if (keybinding === 'emacs') {
      enableEmacs();
    }

    // Listen for changes
    const kbHandler = (e: any) => {
      const value = e?.detail as 'default' | 'vim' | 'emacs';
      // disable existing modes
      disableVim();
      disableEmacs();
      if (value === 'vim') enableVim();
      if (value === 'emacs') enableEmacs();
    };
    window.addEventListener('cside:keybindingChange', kbHandler as EventListener);

    const themeHandler = (e: any) => {
      const value = e?.detail as string;
      if (value === 'light') monaco.editor.setTheme('cs-light');else if (value === 'tint') monaco.editor.setTheme('cs-tint');else monaco.editor.setTheme('cs-dark');
    };
    window.addEventListener('cside:themeChange', themeHandler as EventListener);

    // cleanup when editor disposes
    try {
      editor.onDidDispose(() => {
        try {
          disableVim();
          disableEmacs();
          window.removeEventListener('cside:keybindingChange', kbHandler as EventListener);
          window.removeEventListener('cside:themeChange', themeHandler as EventListener);
        } catch (e) { /* ignore */ }
      });
    } catch (e) { /* ignore */ }
  };
  
  return <div className="flex h-full overflow-hidden">
      <FileTree 
        files={project?.files || []}
        activeFileId={activeFileId}
        onSelectFile={(file) => setActiveFileId(file.id)}
      />

      <div className="flex-1 flex flex-col min-w-0 bg-charcoal">
        <TabBar />

        {activeFileId && <Breadcrumb path={breadcrumbPath} />}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 min-h-0">
            {/* Editor + Right Panel */}
            <Split
              className="h-full flex min-h-0"
              sizes={[60, 40]}
              minSize={[400, 300]}
              gutterSize={4}
              direction="horizontal"
            >
              {/* Editor Section */}
              <div className="flex flex-col min-w-0">
                <div className="flex-1 min-w-0">
                  <Editor 
                    key={activeFileId}
                    height="100%" 
                    defaultLanguage="typescript" 
                    value={code} 
                    onMount={handleEditorDidMount} 
                    options={{
                      fontFamily: 'JetBrains Mono',
                      fontSize: fontSize,
                      lineHeight: 24,
                      minimap: {
                        enabled: minimap
                      },
                      tabSize: tabSize,
                      lineNumbers: lineNumbers,
                      wordWrap: wordWrap,
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      cursorBlinking: 'smooth',
                      cursorSmoothCaretAnimation: 'on',
                      padding: {
                        top: 16
                      },
                      renderLineHighlight: 'all'
                    }} 
                  />
                </div>
              </div>

              {/* Right Panel */}
              <div className="flex flex-col min-w-0 border-l border-charcoal-lighter">
                {/* Right Panel Tabs */}
                <div className="flex items-center gap-1 px-2 py-2 border-b border-charcoal-lighter bg-charcoal-darker">
                  <button
                    onClick={() => setRightPanel('preview')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      rightPanel === 'preview'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-lighter'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => setRightPanel('dependencies')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      rightPanel === 'dependencies'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-lighter'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    Packages
                  </button>
                  <button
                    onClick={() => setRightPanel('cardano')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      rightPanel === 'cardano'
                        ? 'bg-amber-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-lighter'
                    }`}
                  >
                    <Hammer className="w-4 h-4" />
                    Cardano
                  </button>
                </div>

                {/* Right Panel Content */}
                <div className="flex-1 min-h-0">
                  {rightPanel === 'preview' && (
                    <SandboxPreview 
                      files={filesForPreview}
                      activeFile={activeFile?.name}
                      onConsoleLog={(logs) => {
                        if (logs.length === 0) {
                          setConsoleLogs([]);
                          return;
                        }
                        setConsoleLogs(prev => [...prev, ...logs]);
                      }}
                    />
                  )}
                  {rightPanel === 'dependencies' && (
                    <DependencyManager
                      dependencies={dependencies}
                      onAdd={handleAddDependency}
                      onRemove={handleRemoveDependency}
                      onInstall={handleInstallDependencies}
                    />
                  )}
                  {rightPanel === 'cardano' && (
                    <CardanoTools
                      onGenerateWallet={handleGenerateWallet}
                      onCreateContract={handleCreateContract}
                      onValidateMetadata={handleValidateMetadata}
                    />
                  )}
                </div>
              </div>
            </Split>
          </div>

          {/* Bottom Panel */}
          <div className="h-56 min-h-[180px] border-t border-charcoal-lighter bg-charcoal-darker flex flex-col">
            <div className="flex items-center gap-1 px-2 py-1 border-b border-charcoal-lighter">
              <button
                onClick={() => setBottomPanel('console')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  bottomPanel === 'console'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-lighter'
                }`}
              >
                Console
              </button>
              <button
                onClick={() => setBottomPanel('terminal')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  bottomPanel === 'terminal'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-lighter'
                }`}
              >
                Terminal
              </button>
            </div>

            <div className="flex-1 min-h-0">
              {bottomPanel === 'console' ? (
                <ConsoleOutput logs={consoleLogs} onClear={handleClearConsole} />
              ) : (
                <div className="h-full p-3">
                  <TerminalBar />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>;
}