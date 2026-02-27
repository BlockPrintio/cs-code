import React, { useEffect, useRef } from 'react';
import { Terminal, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

export interface ConsoleLog {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: number;
}

interface ConsoleOutputProps {
  logs: ConsoleLog[];
  onClear?: () => void;
}

export function ConsoleOutput({ logs, onClear }: ConsoleOutputProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-slate-300';
    }
  };

  const getLogIcon = (type: ConsoleLog['type']) => {
    switch (type) {
      case 'error':
        return '✕';
      case 'warn':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '»';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  return (
    <div className="h-full flex flex-col bg-charcoal-darker">
      <div className="flex items-center justify-between px-3 py-2 border-b border-charcoal-lighter">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-semibold text-slate-200">Console</span>
          <span className="text-xs text-slate-500">({logs.length})</span>
        </div>
        <button
          onClick={onClear}
          className="p-1.5 rounded hover:bg-charcoal-lighter transition-colors"
          title="Clear Console"
        >
          <Trash2 className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-3 py-2 text-sm font-mono"
      >
        {logs.length === 0 ? (
          <div className="text-slate-500 italic">No console output yet...</div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`py-1 border-b border-charcoal-lighter/30 flex items-start gap-2 ${getLogColor(log.type)}`}
            >
              <span className="opacity-70 text-xs mt-0.5">{getLogIcon(log.type)}</span>
              <div className="flex-1 min-w-0">
                <div className="whitespace-pre-wrap break-words">{log.message}</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  {formatTimestamp(log.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
