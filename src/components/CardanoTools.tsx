import React, { useState } from 'react';
import { Wallet, Key, Code, FileText, Network, Zap } from 'lucide-react';

interface CardanoToolsProps {
  onGenerateWallet?: () => void;
  onCreateContract?: () => void;
  onValidateMetadata?: () => void;
}

export function CardanoTools({ onGenerateWallet, onCreateContract, onValidateMetadata }: CardanoToolsProps) {
  const [activeTab, setActiveTab] = useState<'wallet' | 'contract' | 'metadata' | 'sdk'>('sdk');

  const sdkTemplates = [
    {
      id: 'lucid-transaction',
      name: 'Lucid Transaction',
      description: 'Send ADA using Lucid',
      icon: <Zap className="w-5 h-5" />,
      code: `import { Lucid, Blockfrost } from "@lucid-evolution/lucid";

const lucid = await Lucid.new(
  new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "your-api-key"),
  "Preview",
);

const api = await window.cardano.nami.enable();
lucid.selectWallet(api);

const tx = await lucid
  .newTx()
  .payToAddress("addr_test...", { lovelace: 5000000n })
  .complete();

const signedTx = await tx.sign().complete();
const txHash = await signedTx.submit();

console.log(\`Transaction submitted: \${txHash}\`);`
    },
    {
      id: 'mesh-minting',
      name: 'Mesh NFT Minting',
      description: 'Mint an NFT with Mesh',
      icon: <FileText className="w-5 h-5" />,
      code: `import { MeshWallet, Transaction, ForgeScript } from '@meshsdk/core';

const wallet = new MeshWallet({
  networkId: 0,
  key: {
    type: 'mnemonic',
    words: 'your mnemonic phrase here...',
  },
});

const forgingScript = ForgeScript.withOneSignature(
  wallet.getPaymentAddress()
);

const assetMetadata = {
  name: 'My NFT',
  image: 'ipfs://...',
  description: 'A unique NFT',
};

const tx = new Transaction({ initiator: wallet })
  .mintAsset(forgingScript, assetMetadata);

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);

console.log(\`NFT minted: \${txHash}\`);`
    },
    {
      id: 'plutus-validator',
      name: 'Plutus Validator',
      description: 'Basic Plutus script',
      icon: <Code className="w-5 h-5" />,
      code: `{-# LANGUAGE DataKinds #-}
{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE OverloadedStrings #-}

module AlwaysSucceeds where

import PlutusTx
import PlutusTx.Prelude
import Plutus.V2.Ledger.Api
import Plutus.V2.Ledger.Contexts

{-# INLINABLE mkValidator #-}
mkValidator :: BuiltinData -> BuiltinData -> BuiltinData -> ()
mkValidator _ _ _ = ()

validator :: Validator
validator = mkValidatorScript $$(PlutusTx.compile [|| mkValidator ||])

validatorHash :: ValidatorHash
validatorHash = Scripts.validatorHash validator`
    },
    {
      id: 'wallet-connect',
      name: 'Wallet Connection',
      description: 'Connect to CIP-30 wallet',
      icon: <Wallet className="w-5 h-5" />,
      code: `// Connect to Cardano wallet (CIP-30)
async function connectWallet() {
  try {
    // Check if wallet is installed
    if (!window.cardano?.nami) {
      throw new Error('Nami wallet not found');
    }

    // Enable wallet
    const api = await window.cardano.nami.enable();
    
    // Get wallet info  
    const networkId = await api.getNetworkId();
    const balance = await api.getBalance();
    const usedAddresses = await api.getUsedAddresses();
    const unusedAddresses = await api.getUnusedAddresses();
    
    console.log('Connected to wallet!');
    console.log('Network:', networkId === 1 ? 'Mainnet' : 'Testnet');
    console.log('Balance:', balance);
    console.log('Addresses:', usedAddresses);
    
    return api;
  } catch (error) {
    console.error('Failed to connect:', error);
    throw error;
  }
}

// Usage
const walletApi = await connectWallet();`
    },
  ];

  const insertTemplate = (code: string) => {
    // Dispatch custom event to insert code in editor
    window.dispatchEvent(new CustomEvent('cardano:insertCode', { detail: code }));
  };

  return (
    <div className="h-full flex flex-col bg-charcoal">
      <div className="flex items-center gap-1 px-3 py-2 border-b border-charcoal-lighter bg-charcoal-darker">
        <button
          onClick={() => setActiveTab('sdk')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            activeTab === 'sdk'
              ? 'bg-amber-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-lighter'
          }`}
        >
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            SDK Templates
          </div>
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            activeTab === 'wallet'
              ? 'bg-amber-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-lighter'
          }`}
        >
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet Utils
          </div>
        </button>
        <button
          onClick={() => setActiveTab('metadata')}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            activeTab === 'metadata'
              ? 'bg-amber-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-charcoal-lighter'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Metadata
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'sdk' && (
          <div className="space-y-3">
            {sdkTemplates.map((template) => (
              <div
                key={template.id}
                className="p-4 bg-charcoal-darker border border-charcoal-lighter rounded-lg hover:border-amber-600 transition-colors group cursor-pointer"
                onClick={() => insertTemplate(template.code)}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-600/20 rounded text-amber-500">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-slate-200 mb-1">
                      {template.name}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">
                      {template.description}
                    </p>
                    <button className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs rounded font-medium transition-colors opacity-0 group-hover:opacity-100">
                      Insert Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-4">
            <div className="p-4 bg-charcoal-darker border border-charcoal-lighter rounded-lg">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                Generate Test Wallet
              </h3>
              <button
                onClick={onGenerateWallet}
                className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors"
              >
                Generate New Wallet
              </button>
            </div>

            <div className="p-4 bg-charcoal-darker border border-charcoal-lighter rounded-lg">
              <h3 className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <Network className="w-4 h-4 text-amber-500" />
                Network Selection
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-charcoal rounded hover:bg-charcoal-lighter cursor-pointer">
                  <span className="text-sm text-slate-300">Mainnet</span>
                  <span className="text-xs text-green-400">●</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-charcoal rounded hover:bg-charcoal-lighter cursor-pointer">
                  <span className="text-sm text-slate-300">Preview Testnet</span>
                  <span className="text-xs text-slate-600">○</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-charcoal rounded hover:bg-charcoal-lighter cursor-pointer">
                  <span className="text-sm text-slate-300">Preprod Testnet</span>
                  <span className="text-xs text-slate-600">○</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metadata' && (
          <div className="space-y-4">
            <div className="p-4 bg-charcoal-darker border border-charcoal-lighter rounded-lg">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">
                CIP-25 NFT Metadata
              </h3>
              <div className="text-xs text-slate-400 mb-3 font-mono bg-charcoal p-3 rounded overflow-x-auto">
                <pre>{`{
  "721": {
    "policy_id": {
      "asset_name": {
        "name": "My NFT",
        "image": "ipfs://...",
        "description": "...",
        "files": [{
          "name": "...",
          "mediaType": "image/png",
          "src": "ipfs://..."
        }]
      }
    }
  }
}`}</pre>
              </div>
              <button
                onClick={onValidateMetadata}
                className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors"
              >
                Validate Metadata
              </button>
            </div>

            <div className="p-4 bg-charcoal-darker border border-charcoal-lighter rounded-lg">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">
                CIP-68 Reference NFT
              </h3>
              <div className="text-xs text-slate-400 mb-3">
                Create on-chain metadata references for your Cardano assets
              </div>
              <button className="w-full px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium transition-colors">
                Create Reference NFT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
