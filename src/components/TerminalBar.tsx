import React, { useMemo, useState } from 'react';
import { ConsoleLog } from './ConsoleLog';

export function TerminalBar() {
  const [logs] = useState(() => {
    const now = new Date();
    const fmt = (d: Date) => d.toLocaleTimeString();
    return [
      { id: '1', timestamp: fmt(now), type: 'info' as const, message: 'Development server running on http://localhost:3000', source: 'dev' },
      { id: '2', timestamp: fmt(new Date(now.getTime() + 1000)), type: 'success' as const, message: 'Build completed successfully', source: 'build' },
      { id: '3', timestamp: fmt(new Date(now.getTime() + 2000)), type: 'warning' as const, message: 'Unused variable in App.tsx', source: 'eslint' }
    ];
  });

  const header = useMemo(() => {
    return (
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold">Terminal</div>
          <div className="text-xs text-gray-400">bash</div>
        </div>
        <div className="text-xs text-gray-400">Output</div>
      </div>
    );
  }, []);

  return (
    <div className="h-full flex flex-col min-h-0">
      {header}
      <div className="flex-1 min-h-0">
        <ConsoleLog logs={logs} />
      </div>
    </div>
  );
}

export default TerminalBar;
