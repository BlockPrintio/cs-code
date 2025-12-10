import React, { useState } from 'react';
import { Rocket, CheckCircle, Clock, AlertCircle, Terminal } from 'lucide-react';

interface DeploymentItem {
  id: string;
  network: 'MAINNET' | 'PREPROD' | 'PREVIEW';
  version: string;
  name: string;
  address: string;
  status: 'Active' | 'Deploying' | 'Failed';
  epoch: number;
}

export function Deployment() {
  const [deployments, setDeployments] = useState<DeploymentItem[]>([
    {
      id: '1',
      network: 'MAINNET',
      version: 'v2.4.0',
      name: 'dex-validator',
      address: 'addr1qx...7k9m',
      status: 'Active',
      epoch: 445
    },
    {
      id: '2',
      network: 'PREPROD',
      version: 'v2.4.1-beta',
      name: 'dex-validator-test',
      address: 'addr_test1qz...3n2p',
      status: 'Active',
      epoch: 112
    },
    {
      id: '3',
      network: 'PREVIEW',
      version: 'v2.5.0-dev',
      name: 'experimental-v3',
      address: 'addr_test1qp...8x4k',
      status: 'Active',
      epoch: 89
    }
  ]);

  const handleNewDeployment = () => {
    const newDeployment: DeploymentItem = {
      id: Math.random().toString(36).substr(2, 9),
      network: 'PREVIEW',
      version: 'v2.5.1-rc',
      name: `deployment-${Math.floor(Math.random() * 1000)}`,
      address: 'addr_test1...pending',
      status: 'Deploying',
      epoch: 90
    };
    setDeployments([newDeployment, ...deployments]);
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'MAINNET': return 'text-terminal-green border-terminal-green/30 bg-terminal-green/20';
      case 'PREPROD': return 'text-amber border-amber/30 bg-amber/20';
      default: return 'text-terminal-blue border-terminal-blue/30 bg-terminal-blue/20';
    }
  };

  return <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-theme-text mb-2">Deployments</h1>
          <p className="text-theme-muted">
            Deploy validator scripts to Cardano networks via Blockfrost.
          </p>
        </div>
        <button 
          onClick={handleNewDeployment}
          className="bg-terminal-purple hover:bg-terminal-purple/90 text-white font-bold py-2 px-6 rounded-md flex items-center gap-2 transition-colors shadow-lg shadow-terminal-purple/20">
          <Rocket size={18} />
          New Deployment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {deployments.map(deploy => (
          <div key={deploy.id} className="bg-charcoal-light border border-charcoal-lighter rounded-lg p-6 relative overflow-hidden group">
            {deploy.network === 'MAINNET' && (
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Rocket size={100} />
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getNetworkColor(deploy.network)}`}>
                {deploy.network}
              </span>
              <span className="text-theme-muted text-xs font-mono">{deploy.version}</span>
            </div>
            
            <h3 className="text-2xl font-bold text-theme-text mb-1 truncate" title={deploy.name}>
              {deploy.name}
            </h3>
            
            <a href="#" className="text-terminal-blue hover:underline text-sm mb-6 block font-mono">
              {deploy.address}
            </a>

            <div className="flex items-center gap-4 text-sm text-theme-muted">
              <div className="flex items-center gap-1.5">
                {deploy.status === 'Active' ? <CheckCircle size={14} className="text-terminal-green" /> : <Clock size={14} className="text-amber animate-pulse" />}
                <span>{deploy.status}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>Epoch {deploy.epoch}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Log */}
      <div className="bg-charcoal-dark border border-charcoal-lighter rounded-lg overflow-hidden">
        <div className="p-4 bg-charcoal-light border-b border-charcoal-lighter flex items-center gap-2">
          <Terminal size={16} className="text-gray-400" />
          <h3 className="font-bold text-gray-300 text-sm">
            Deployment Activity
          </h3>
        </div>
        <div className="p-4 space-y-4">
          {[{
          status: 'success',
          msg: 'Deployed v2.4.0 validator script to Mainnet',
          time: '5 mins ago',
          user: 'alex'
        }, {
          status: 'success',
          msg: 'Plutus compilation completed for commit 8f3a21',
          time: '7 mins ago',
          user: 'system'
        }, {
          status: 'error',
          msg: 'Deployment failed: Transaction fee estimation timeout',
          time: '2 hours ago',
          user: 'system'
        }, {
          status: 'warning',
          msg: 'Rollback initiated to v2.3.9 on Preprod',
          time: '2 hours ago',
          user: 'alex'
        }].map((log, i) => <div key={i} className="flex items-start gap-4 text-sm font-mono">
              <div className="mt-1">
                {log.status === 'success' && <CheckCircle size={14} className="text-terminal-green" />}
                {log.status === 'error' && <AlertCircle size={14} className="text-terminal-red" />}
                {log.status === 'warning' && <AlertCircle size={14} className="text-amber" />}
              </div>
              <div className="flex-1">
                <p className="text-gray-300">{log.msg}</p>
                <div className="flex gap-2 text-xs text-gray-600 mt-0.5">
                  <span>{log.time}</span>
                  <span>•</span>
                  <span>by {log.user}</span>
                </div>
              </div>
            </div>)}
        </div>
      </div>
    </div>;
}