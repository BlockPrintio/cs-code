import { Project, FileNode } from '../types';

const defaultFiles: FileNode[] = [
  {
    id: 'src',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: 'components',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: 'App.tsx',
            name: 'App.tsx',
            type: 'file',
            extension: 'tsx',
            content: `import React from 'react';\n\nexport function App() {\n  return <div>Hello World</div>;\n}`
          },
          {
            id: 'Button.tsx',
            name: 'Button.tsx',
            type: 'file',
            extension: 'tsx',
            content: `import React from 'react';\n\nexport const Button = () => <button>Click me</button>;`
          }
        ]
      },
      {
        id: 'index.css',
        name: 'index.css',
        type: 'file',
        extension: 'css',
        content: `body { background: #000; color: #fff; }`
      }
    ]
  },
  {
    id: 'package.json',
    name: 'package.json',
    type: 'file',
    extension: 'json',
    content: `{\n  "name": "project",\n  "version": "1.0.0"\n}`
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'defi-exchange-v2',
    description: 'Next generation decentralized exchange with automated market maker protocol.',
    language: 'TypeScript',
    lastEdited: '2h ago',
    branch: 'feature/liquidity',
    status: 'active',
    files: defaultFiles
  },
  {
    id: '2',
    title: 'nft-marketplace-ui',
    description: 'Frontend interface for the NFT marketplace including wallet integration.',
    language: 'React',
    lastEdited: '5h ago',
    branch: 'main',
    status: 'building',
    files: defaultFiles
  },
  {
    id: '3',
    title: 'validator-script-audits',
    description: 'Collection of automated audit scripts and security verification tools for Cardano.',
    language: 'Plutus',
    lastEdited: '2d ago',
    branch: 'develop',
    status: 'archived',
    files: defaultFiles
  },
  {
    id: '4',
    title: 'governance-token',
    description: 'Native token implementation with voting capabilities and delegation.',
    language: 'Aiken',
    lastEdited: '1w ago',
    branch: 'main',
    status: 'archived',
    files: defaultFiles
  }
];
