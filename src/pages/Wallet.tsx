import React from 'react';
import { Wallet as WalletIcon, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { useToast } from '../components/ToastProvider';
export function Wallet() {
  const { addToast } = useToast();
  const walletAddress = 'addr1qxy2kgd9r7xj8c9e4p2j9v3xk6n7r0x8t9u0v1w2x3y4z5';
  const displayAddress = `${walletAddress.slice(0, 10)}...${walletAddress.slice(-6)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      addToast({ type: 'success', message: 'Wallet address copied.' });
    } catch (e) {
      addToast({ type: 'error', message: 'Copy failed.' });
    }
  };

  const handleExplorer = () => {
    window.open(`https://cardanoscan.io/address/${walletAddress}`, '_blank', 'noopener,noreferrer');
    addToast({ type: 'info', message: 'Opened Cardanoscan.' });
  };

  const handleRefresh = () => {
    addToast({ type: 'info', message: 'Wallet data refreshed.' });
  };
  return <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">
        Wallet Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Main Wallet Card */}
        <div className="bg-gradient-to-br from-charcoal-light to-charcoal-lighter border border-charcoal-lighter rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <WalletIcon size={120} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-terminal-green shadow-[0_0_8px_rgba(80,250,123,0.5)]"></div>
              <span className="text-terminal-green text-sm font-mono">
                Cardano Mainnet
              </span>
            </div>

            <div className="mb-8">
              <span className="text-gray-500 text-sm block mb-1">
                Total Balance
              </span>
              <div className="text-4xl font-bold text-white font-mono">
                142,050 <span className="text-amber">₳</span>
              </div>
              <span className="text-gray-500 text-sm">≈ $56,820.00 USD</span>
            </div>

            <div className="bg-charcoal-dark/50 rounded-lg p-3 flex items-center justify-between border border-charcoal-dark">
              <code className="text-gray-300 text-sm font-mono">
                {displayAddress}
              </code>
              <div className="flex gap-2">
                <button onClick={handleCopy} title="Copy address" className="p-1.5 hover:bg-charcoal-light rounded text-gray-400 hover:text-white transition-colors">
                  <Copy size={16} />
                </button>
                <button onClick={handleExplorer} title="View on explorer" className="p-1.5 hover:bg-charcoal-light rounded text-gray-400 hover:text-white transition-colors">
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className="bg-charcoal-light border border-charcoal-lighter rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-200 mb-4">
            Network Status
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-charcoal-lighter/50">
              <span className="text-gray-400 text-sm">Epoch / Slot</span>
              <span className="text-terminal-blue font-mono">
                445 / 128,902
              </span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-charcoal-lighter/50">
              <span className="text-gray-400 text-sm">Transaction Fee</span>
              <span className="text-terminal-yellow font-mono">0.17 ₳</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-charcoal-lighter/50">
              <span className="text-gray-400 text-sm">Connected Wallet</span>
              <span className="text-gray-200 font-mono">Nami</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Sync Status</span>
              <span className="text-terminal-green font-mono">100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-charcoal-light border border-charcoal-lighter rounded-xl overflow-hidden">
        <div className="p-4 border-b border-charcoal-lighter flex justify-between items-center">
          <h3 className="font-bold text-gray-200">Recent Transactions</h3>
          <button onClick={handleRefresh} title="Refresh transactions" className="text-gray-500 hover:text-white transition-colors">
            <RefreshCw size={16} />
          </button>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-charcoal-lighter text-gray-500 font-mono text-xs uppercase">
            <tr>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Hash</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal-lighter">
            {[1, 2, 3].map(i => <tr key={i} className="hover:bg-charcoal-lighter/30 transition-colors">
                <td className="px-6 py-4 text-gray-300">Validator Script</td>
                <td className="px-6 py-4 font-mono text-terminal-blue">
                  3a7f...92b4
                </td>
                <td className="px-6 py-4 font-mono text-gray-300">50 ₳</td>
                <td className="px-6 py-4 text-gray-500">2 mins ago</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full bg-terminal-green/10 text-terminal-green text-xs font-bold border border-terminal-green/20">
                    CONFIRMED
                  </span>
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>;
}