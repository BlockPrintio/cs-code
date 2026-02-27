import { useEffect, useMemo, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { Dashboard } from './pages/Dashboard';
import { EditorPage } from './pages/Editor';
import { Templates, TemplateItem } from './pages/Templates';
import { Testing } from './pages/Testing';
import { Wallet } from './pages/Wallet';
import { Deployment } from './pages/Deployment';
import { Settings } from './pages/Settings';
import { Landing } from './pages/Landing';
import { motion, AnimatePresence } from 'framer-motion';
import { mockProjects } from './data/mockProjects';
import { Project } from './types';
import { useToast } from './components/ToastProvider';
import { downloadProjectZip } from './utils/projectExport';

type View = 'landing' | 'dashboard' | 'editor' | 'templates' | 'testing' | 'wallet' | 'deployment' | 'settings';

export function App() {
  const { addToast } = useToast();
  const apiBase = useMemo(() => import.meta.env.VITE_API_URL || '', []);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [authUser, setAuthUser] = useState<{ provider: string; name?: string; username?: string } | null>(null);

  const handleOpenProject = (projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentView('editor');
  };

  const handleCreateProject = () => {
    // Mock creation for now
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: `New Project ${projects.length + 1}`,
      description: 'A brand new project',
      language: 'TypeScript',
      lastEdited: 'Just now',
      branch: 'main',
      status: 'active',
      files: mockProjects[0].files // Copy default files
    };
    setProjects(prev => [newProject, ...prev]);
    handleOpenProject(newProject.id);
  };

  const handleSignIn = (provider: 'google' | 'github') => {
    const url = `${apiBase}/auth/${provider}`;
    window.location.href = url;
  };

  const fetchMe = async () => {
    try {
      const res = await fetch(`${apiBase}/api/me`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.user) {
        setAuthUser(data.user);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${apiBase}/api/logout`, { method: 'POST', credentials: 'include' });
      setAuthUser(null);
      setCurrentView('landing');
      addToast({ type: 'info', message: 'Logged out.' });
    } catch (e) {
      addToast({ type: 'error', message: 'Logout failed.' });
    }
  };

  const handleDownloadProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    downloadProjectZip(project).then(() => {
      addToast({ type: 'success', message: `Downloaded ${project.title}.zip` });
    }).catch(() => addToast({ type: 'error', message: 'Download failed.' }));
  };

  const handlePushProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    if (!authUser || authUser.provider !== 'github') {
      addToast({ type: 'info', message: 'Connect GitHub to push.' });
      handleSignIn('github');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/api/github/push-project`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: project.title,
          description: project.description,
          files: project.files
        })
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        addToast({ type: 'error', message: error?.message || 'GitHub push failed.' });
        return;
      }
      const data = await res.json();
      addToast({ type: 'success', message: `Pushed to ${data?.repoUrl || 'GitHub'}` });
    } catch (e) {
      addToast({ type: 'error', message: 'GitHub push failed.' });
    }
  };

  const handleRenameProject = (projectId: string, newTitle: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, title: newTitle } : p));
    addToast({ type: 'info', message: `Renamed project to ${newTitle}` });
  };

  const handleUseTemplate = (template: TemplateItem) => {
    const newProject: Project = {
      id: Math.random().toString(36).substr(2, 9),
      title: template.title,
      description: template.description,
      language: template.tags[0] || 'TypeScript',
      lastEdited: 'Just now',
      branch: 'main',
      status: 'active',
      files: mockProjects[0].files
    };
    setProjects(prev => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setCurrentView('editor');
    addToast({ type: 'success', message: `Created ${template.title}` });
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('auth') === 'success') {
      fetchMe().then(() => {
        setCurrentView('dashboard');
        addToast({ type: 'success', message: 'Signed in successfully.' });
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      fetchMe();
    }
    if (params.get('auth') === 'failed') {
      addToast({ type: 'error', message: 'Sign in failed.' });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const activeProject = projects.find(p => p.id === activeProjectId);

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return (
          <Landing
            onGetStarted={() => setCurrentView('dashboard')}
            onAuth={handleSignIn}
          />
        );
      case 'dashboard':
        return <Dashboard 
          projects={projects} 
          onOpenProject={handleOpenProject}
          onCreateProject={handleCreateProject}
          onSignIn={handleSignIn}
          onDownloadProject={handleDownloadProject}
          onPushProject={handlePushProject}
          onRenameProject={handleRenameProject}
          onUseTemplate={handleUseTemplate}
        />;
      case 'editor':
        return <EditorPage project={activeProject} />;
      case 'templates':
        return <Templates onUseTemplate={handleUseTemplate} />;
      case 'testing':
        return <Testing />;
      case 'wallet':
        return <Wallet />;
      case 'deployment':
        return <Deployment />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard 
          projects={projects} 
          onOpenProject={handleOpenProject}
          onCreateProject={handleCreateProject}
          onSignIn={handleSignIn}
          onDownloadProject={handleDownloadProject}
          onPushProject={handlePushProject}
          onRenameProject={handleRenameProject}
          onUseTemplate={handleUseTemplate}
        />;
    }
  };
  if (currentView === 'landing') {
    return <div className="h-screen w-full font-sans selection:bg-amber/30 selection:text-amber">
        {renderView()}
      </div>;
  }

  return <div className="flex flex-col h-screen w-full bg-charcoal text-gray-300 overflow-hidden font-sans selection:bg-amber/30 selection:text-amber">
      <div className="scanline-overlay" />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar currentView={currentView} onChangeView={setCurrentView} onLogout={handleLogout} />

        <main className="flex-1 relative overflow-hidden bg-charcoal">
          <AnimatePresence mode="wait">
            <motion.div key={currentView} initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -10
          }} transition={{
            duration: 0.2
          }} className="h-full w-full">
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <StatusBar />
    </div>;
}