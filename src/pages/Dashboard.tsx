import React from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { TemplateCard } from '../components/TemplateCard';
import { Plus, Atom, Layers, Shield, Cpu, Github, Chrome } from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onOpenProject: (id: string) => void;
  onCreateProject: () => void;
  onSignIn?: (provider: 'google' | 'github') => void;
  onDownloadProject?: (projectId: string) => void;
  onPushProject?: (projectId: string) => void;
  onRenameProject?: (projectId: string, newTitle: string) => void;
  onUseTemplate?: (template: { title: string; description: string; tags: string[] }) => void;
}

export function Dashboard({
  projects,
  onOpenProject,
  onCreateProject,
  onSignIn,
  onDownloadProject,
  onPushProject,
  onRenameProject,
  onUseTemplate
}: DashboardProps) {
    return <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
      <header className="mb-8 flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-theme-text mb-2">Dashboard</h1>
          <p className="text-theme-muted">
            Welcome back, Developer. You have {projects.filter(p => p.status === 'active').length} active projects.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {onSignIn && (
            <>
              <button
                onClick={() => onSignIn('google')}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-charcoal-lighter hover:bg-charcoal-light text-theme-muted hover:text-theme-text transition-colors border border-charcoal-lighter w-full sm:w-auto"
                title="Sign in with Google"
              >
                <Chrome size={16} />
                <span className="text-sm font-mono">Google</span>
              </button>
              <button
                onClick={() => onSignIn('github')}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-charcoal-lighter hover:bg-charcoal-light text-theme-muted hover:text-theme-text transition-colors border border-charcoal-lighter w-full sm:w-auto"
                title="Sign in with GitHub"
              >
                <Github size={16} />
                <span className="text-sm font-mono">GitHub</span>
              </button>
            </>
          )}
          <button 
            onClick={onCreateProject}
            className="bg-amber hover:bg-amber-dim text-charcoal-dark font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2 transition-colors w-full sm:w-auto">
            <Plus size={18} />
            New Project
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <ProjectCard
            key={project.id}
            id={project.id}
            title={project.title} 
            description={project.description} 
            language={project.language} 
            lastEdited={project.lastEdited} 
            branch={project.branch} 
            status={project.status} 
            onOpen={onOpenProject}
            onDownload={onDownloadProject}
            onPushGithub={onPushProject}
            onRenameProject={onRenameProject}
          />
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold text-theme-text mb-6">Recommended Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <TemplateCard title="React + Vite + TS" description="Modern frontend stack with fast HMR and TypeScript configuration." tags={['Frontend', 'React', 'Vite']} stars={1240} color="#61DAFB" icon={<Atom size={20} />} onSelect={() => onUseTemplate?.({ title: 'React + Vite + TS', description: 'Modern frontend stack with fast HMR and TypeScript configuration.', tags: ['Frontend', 'React', 'Vite'] })} />
          <TemplateCard title="Next.js Fullstack" description="Complete Next.js 14 setup with App Router, Prisma, and Tailwind." tags={['Fullstack', 'Next.js', 'Prisma']} stars={3500} color="#ffffff" icon={<Layers size={20} />} onSelect={() => onUseTemplate?.({ title: 'Next.js Fullstack', description: 'Complete Next.js 14 setup with App Router, Prisma, and Tailwind.', tags: ['Fullstack', 'Next.js', 'Prisma'] })} />
          <TemplateCard title="Plutus + Aiken Starter" description="Cardano validator script development environment with testing framework." tags={['Web3', 'Plutus', 'Aiken']} stars={890} color="#f1fa8c" icon={<Shield size={20} />} onSelect={() => onUseTemplate?.({ title: 'Plutus + Aiken Starter', description: 'Cardano validator script development environment with testing framework.', tags: ['Web3', 'Plutus', 'Aiken'] })} />
          <TemplateCard title="Rust WebAssembly" description="High-performance WASM modules with Rust and wasm-pack." tags={['Systems', 'Rust', 'WASM']} stars={650} color="#ff5555" icon={<Cpu size={20} />} onSelect={() => onUseTemplate?.({ title: 'Rust WebAssembly', description: 'High-performance WASM modules with Rust and wasm-pack.', tags: ['Systems', 'Rust', 'WASM'] })} />
        </div>
      </div>
    </div>;
}