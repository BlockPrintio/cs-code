import React from 'react';
import { TemplateCard } from '../components/TemplateCard';
import { Search } from 'lucide-react';
export function Templates() {
  return <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-theme-text mb-2">
          Template Library
        </h1>
        <p className="text-theme-muted mb-6">
          Jumpstart your development with production-ready boilerplates.
        </p>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" size={18} />
          <input type="text" placeholder="Search templates..." className="w-full bg-charcoal-light border border-charcoal-lighter rounded-md py-2 pl-10 pr-4 text-theme-text focus:outline-none focus:border-amber focus:ring-1 focus:ring-amber transition-all placeholder:text-theme-muted" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TemplateCard title="React + Vite + TS" description="Modern frontend stack with fast HMR and TypeScript configuration." tags={['Frontend', 'React', 'Vite']} stars={1240} color="#61DAFB" />
        <TemplateCard title="Next.js Fullstack" description="Complete Next.js 14 setup with App Router, Prisma, and Tailwind." tags={['Fullstack', 'Next.js', 'Prisma']} stars={3500} color="#ffffff" />
        <TemplateCard title="Plutus + Aiken Starter" description="Cardano validator script development environment with testing framework." tags={['Web3', 'Plutus', 'Aiken']} stars={890} color="#f1fa8c" />
        <TemplateCard title="Rust WebAssembly" description="High-performance WASM modules with Rust and wasm-pack." tags={['Systems', 'Rust', 'WASM']} stars={650} color="#ff5555" />
        <TemplateCard title="Express API" description="RESTful API starter with Swagger docs and JWT auth." tags={['Backend', 'Node', 'Express']} stars={420} color="#50fa7b" />
        <TemplateCard title="Python Data Science" description="Jupyter notebook environment with Pandas and PyTorch." tags={['Data', 'Python', 'AI']} stars={1100} color="#bd93f9" />
      </div>
    </div>;
}