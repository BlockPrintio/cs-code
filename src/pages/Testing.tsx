import React, { useState } from 'react';
import { ConsoleLog } from '../components/ConsoleLog';
import { Play, RotateCcw, Filter, Loader2 } from 'lucide-react';

export function Testing() {
  interface LogEntry {
    id: string;
    timestamp: string;
    type: 'info' | 'error' | 'success' | 'warning';
    message: string;
    source?: string;
  }

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '10:42:01',
      type: 'info',
      message: 'Starting test suite: Authentication',
      source: 'Auth.test.ts'
    },
    // ... initial logs or empty
  ]);

  const runTests = () => {
    setIsRunning(true);
    setLogs([]);
    
    // Simulate test run
    setTimeout(() => {
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'info',
        message: 'Starting test suite: Authentication',
        source: 'Auth.test.ts'
      }]);
    }, 500);

    setTimeout(() => {
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'success',
        message: '✓ Login with valid credentials passed',
        source: 'Auth.test.ts'
      }]);
    }, 1500);
    
    setTimeout(() => {
      setLogs(prev => [...prev, {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'error',
        message: '✗ Insufficient funds check failed',
        source: 'Token.test.ts'
      }]);
      setIsRunning(false);
    }, 3000);
  };

  return <div className="flex flex-col h-full bg-charcoal p-4">
      <header className="flex justify-between items-center mb-4 pb-4 border-b border-charcoal-lighter">
        <h2 className="text-xl font-bold text-theme-text flex items-center gap-2">
          {isRunning ? <Loader2 className="animate-spin text-amber" /> : <span className="w-3 h-3 rounded-full bg-terminal-red"></span>}
          Test Runner
        </h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-charcoal-lighter hover:bg-charcoal-light text-theme-muted hover:text-theme-text rounded text-sm transition-colors">
            <Filter size={14} />
            Filter
          </button>
          <button 
            onClick={() => setLogs([])}
            className="flex items-center gap-2 px-3 py-1.5 bg-charcoal-lighter hover:bg-charcoal-light text-theme-muted hover:text-theme-text rounded text-sm transition-colors">
            <RotateCcw size={14} />
            Reset
          </button>
          <button 
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-1.5 bg-terminal-green text-charcoal-dark font-bold rounded text-sm hover:bg-terminal-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
            {isRunning ? 'Running...' : 'Run All Tests'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 h-full min-h-0">
        <div className="col-span-1 bg-charcoal-light rounded-lg border border-charcoal-lighter p-4 overflow-y-auto">
          <h3 className="text-sm font-bold text-theme-muted mb-3 uppercase tracking-wider">
            Test Suites
          </h3>
          <div className="space-y-2">
            {['Auth.test.ts', 'Token.test.ts', 'Wallet.test.ts', 'Network.test.ts'].map((suite, i) => <div key={suite} className="flex items-center justify-between p-2 rounded hover:bg-charcoal-lighter cursor-pointer group">
                <span className="text-sm text-theme-muted group-hover:text-theme-text font-mono transition-colors">{suite}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${i === 1 ? 'bg-terminal-red/20 text-terminal-red' : 'bg-terminal-green/20 text-terminal-green'}`}>
                  {i === 1 ? 'FAIL' : 'PASS'}
                </span>
              </div>)}
          </div>
        </div>

        <div className="col-span-2 flex flex-col min-h-0">
          <ConsoleLog logs={logs} />
        </div>
      </div>
    </div>;
}