import React from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { TemplateCard } from '../components/TemplateCard';
import { Plus } from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  projects: Project[];
  onOpenProject: (id: string) => void;
  onCreateProject: () => void;
}

export function Dashboard({ projects, onOpenProject, onCreateProject }: DashboardProps) {
  return <div className="p-8 h-full overflow-y-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-theme-text mb-2">Dashboard</h1>
          <p className="text-theme-muted">
            Welcome back, Developer. You have {projects.filter(p => p.status === 'active').length} active projects.
          </p>
        </div>
        <button 
          onClick={onCreateProject}
          className="bg-amber hover:bg-amber-dim text-charcoal-dark font-bold py-2 px-4 rounded-md flex items-center gap-2 transition-colors">
          <Plus size={18} />
          New Project
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} onClick={() => onOpenProject(project.id)} className="cursor-pointer">
            <ProjectCard 
              title={project.title} 
              description={project.description} 
              language={project.language} 
              lastEdited={project.lastEdited} 
              branch={project.branch} 
              status={project.status} 
            />
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="text-xl font-bold text-theme-text mb-6">Recommended Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <TemplateCard title="React + Vite + TS" description="Modern frontend stack with fast HMR and TypeScript configuration." tags={['Frontend', 'React', 'Vite']} stars={1240} color="#61DAFB" />
          <TemplateCard title="Next.js Fullstack" description="Complete Next.js 14 setup with App Router, Prisma, and Tailwind." tags={['Fullstack', 'Next.js', 'Prisma']} stars={3500} color="#ffffff" />
          <TemplateCard title="Plutus + Aiken Starter" description="Cardano validator script development environment with testing framework." tags={['Web3', 'Plutus', 'Aiken']} stars={890} color="#f1fa8c" />
          <TemplateCard title="Rust WebAssembly" description="High-performance WASM modules with Rust and wasm-pack." tags={['Systems', 'Rust', 'WASM']} stars={650} color="#ff5555" />
        </div>
      </div>
    </div>;
}