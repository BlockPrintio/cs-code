import React, { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { FileTree } from '../components/FileTree';
import { TabBar } from '../components/TabBar';
import { PreviewPane } from '../components/PreviewPane';
import { TerminalBar } from '../components/TerminalBar';
export function EditorPage() {
  const code = `import React from 'react';
import { createRoot } from 'react-dom/client';

function App() {
  return (
    <div className="container">
      <h1>Hello, World!</h1>
      <p>Welcome to your new CS-IDE environment.</p>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
`;
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
  const [themeName, setThemeName] = useState<string>(() => {
    try {
      return (localStorage.getItem('cside:theme') as string) || 'dark';
    } catch (e) {
      return 'dark';
    }
  });
  useEffect(() => {
    const handler = (e: any) => {
      if (typeof e?.detail === 'string') setThemeName(e.detail);
    };
    window.addEventListener('cside:themeChange', handler as EventListener);
    return () => window.removeEventListener('cside:themeChange', handler as EventListener);
  }, []);

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
            const line = pos.lineNumber;
            const column = pos.column;
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
      <FileTree />

      <div className="flex-1 flex flex-col min-w-0 bg-charcoal">
        <TabBar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Editor + Preview columns */}
          <div className="flex-1 flex min-h-0">
            <div className="flex-1 min-w-0">
              <Editor height="100%" defaultLanguage="typescript" defaultValue={code} onMount={handleEditorDidMount} options={{
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
          }} />
            </div>

            <div className="w-1/3 min-w-0 border-l border-charcoal-lighter p-4">
              <PreviewPane code={code} />
            </div>
          </div>

          {/* Terminal bar below editor+preview */}
          <div className="h-48 border-t border-charcoal-lighter p-3 bg-charcoal-darker">
            <TerminalBar />
          </div>
        </div>
      </div>
    </div>;
}