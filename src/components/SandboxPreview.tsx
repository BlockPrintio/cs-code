import { useEffect, useRef, useState } from 'react';
import { Play, RefreshCw, ExternalLink } from 'lucide-react';

interface SandboxPreviewProps {
  files: Record<string, string>;
  activeFile?: string;
  onConsoleLog?: (logs: ConsoleLog[]) => void;
}

export interface ConsoleLog {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: number;
}

export function SandboxPreview({ files, onConsoleLog }: SandboxPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bundleAndRun = () => {
    setIsLoading(true);
    setError(null);
    try {
      // Create a sandbox HTML document with all files
      const htmlFile = files['index.html'] || files[Object.keys(files).find(k => k.endsWith('.html')) || ''] || '';
      const jsFiles = Object.entries(files).filter(([name]) => name.endsWith('.js') || name.endsWith('.jsx'));
      const cssFiles = Object.entries(files).filter(([name]) => name.endsWith('.css'));
      const tsFiles = Object.entries(files).filter(([name]) => name.endsWith('.ts') || name.endsWith('.tsx'));

      // Simple transpilation for TypeScript (basic - just strip types)
      const transpileTS = (code: string) => {
        return code
          .replace(/:\s*\w+(\[\])?/g, '') // Remove type annotations
          .replace(/interface\s+\w+\s*{[^}]*}/g, '') // Remove interfaces
          .replace(/type\s+\w+\s*=\s*[^;]+;/g, '') // Remove type aliases
          .replace(/as\s+\w+/g, '') // Remove type assertions
          .replace(/<\w+>/g, ''); // Remove generic types
      };

      // Bundle all JS/TS code
      let bundledJS = '';
      [...jsFiles, ...tsFiles].forEach(([name, content]) => {
        const code = name.endsWith('.ts') || name.endsWith('.tsx') ? transpileTS(content) : content;
        bundledJS += `\n// File: ${name}\n${code}\n`;
      });

      // Bundle all CSS
      let bundledCSS = '';
      cssFiles.forEach(([name, content]) => {
        bundledCSS += `\n/* File: ${name} */\n${content}\n`;
      });

      // Create sandbox document
      const sandboxHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sandbox Preview</title>
  <style>
    ${bundledCSS}
    body {
      margin: 0;
      padding: 16px;
      font-family: system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body>
  ${htmlFile.includes('<body>') ? htmlFile.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] || '' : htmlFile}
  
  <script>
    // Console interceptor
    (function() {
      const original = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };

      function sendToParent(type, args) {
        try {
          window.parent.postMessage({
            type: 'console',
            level: type,
            message: Array.from(args).map(arg => 
              typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' '),
            timestamp: Date.now()
          }, '*');
        } catch (e) {
          // Ignore cross-origin errors
        }
      }

      console.log = function(...args) {
        original.log.apply(console, args);
        sendToParent('log', args);
      };
      console.error = function(...args) {
        original.error.apply(console, args);
        sendToParent('error', args);
      };
      console.warn = function(...args) {
        original.warn.apply(console, args);
        sendToParent('warn', args);
      };
      console.info = function(...args) {
        original.info.apply(console, args);
        sendToParent('info', args);
      };

      // Error handler
      window.addEventListener('error', function(e) {
        sendToParent('error', [e.message + ' at ' + e.filename + ':' + e.lineno]);
      });

      window.addEventListener('unhandledrejection', function(e) {
        sendToParent('error', ['Unhandled promise rejection: ' + e.reason]);
      });
    })();

    // User code
    try {
      ${bundledJS}
    } catch (err) {
      console.error('Runtime error:', err.message, err.stack);
    }
  </script>
</body>
</html>`;

      if (iframeRef.current) {
        if (objectUrlRef.current) {
          URL.revokeObjectURL(objectUrlRef.current);
        }
        const blob = new Blob([sandboxHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        objectUrlRef.current = url;
        iframeRef.current.src = url;
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create sandbox');
      onConsoleLog?.([
        {
          id: Date.now().toString(),
          type: 'error',
          message: err.message || 'Bundling error',
          timestamp: Date.now()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for console messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'console') {
        const log: ConsoleLog = {
          id: `${event.data.timestamp}-${Math.random()}`,
          type: event.data.level,
          message: event.data.message,
          timestamp: event.data.timestamp
        };
        onConsoleLog?.([log]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  // Auto-run on file changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      bundleAndRun();
    }, 500);
    return () => clearTimeout(timeout);
  }, [files]);

  const handleRefresh = () => {
    onConsoleLog?.([]);
    bundleAndRun();
  };

  const handleOpenInNewTab = () => {
    if (iframeRef.current?.src) {
      window.open(iframeRef.current.src, '_blank');
    }
  };

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col bg-charcoal">
      <div className="flex items-center justify-between px-3 py-2 border-b border-charcoal-lighter bg-charcoal-darker">
        <div className="flex items-center gap-2">
          <Play className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-slate-200">Live Preview</span>
          {isLoading && <span className="text-xs text-slate-400">(Building...)</span>}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded hover:bg-charcoal-lighter transition-colors"
            title="Refresh Preview"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="p-1.5 rounded hover:bg-charcoal-lighter transition-colors"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {error && (
        <div className="px-3 py-2 bg-red-900/20 border-b border-red-800 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="flex-1 bg-white relative">
        <iframe
          ref={iframeRef}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-modals allow-forms"
          title="Sandbox Preview"
        />
      </div>
    </div>
  );
}
