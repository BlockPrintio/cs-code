import React from 'react';
import { ArrowRight, ShieldCheck, Workflow, Blocks, TerminalSquare, Chrome, Github } from 'lucide-react';

interface LandingProps {
  onGetStarted: () => void;
  onAuth: (provider: 'google' | 'github') => void;
}

export function Landing({ onGetStarted, onAuth }: LandingProps) {
  return (
    <div className="min-h-screen text-gray-200 bg-[radial-gradient(1200px_circle_at_20%_-10%,rgba(251,191,36,0.25),transparent_60%),radial-gradient(900px_circle_at_80%_-20%,rgba(96,165,250,0.2),transparent_55%),linear-gradient(180deg,#020617_0%,#0b1020_55%,#0f172a_100%)]">
      <div className="scanline-overlay" />

      <header className="max-w-6xl mx-auto px-8 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md border border-amber/40 bg-amber/10 text-amber flex items-center justify-center font-mono font-bold">
            CS
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-amber/70 font-mono">Cardano Studio</div>
            <div className="text-xl font-semibold">CS Code</div>
          </div>
        </div>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber text-charcoal-dark font-semibold hover:bg-amber-dim transition-colors"
        >
          Get Started
          <ArrowRight size={16} />
        </button>
      </header>

      <section className="max-w-6xl mx-auto px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber/70 font-mono">
              <span className="w-2 h-2 rounded-full bg-terminal-green" />
              Cardano-first IDE
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl font-semibold text-gray-100 leading-tight">
              Build Cardano dApps faster with a focused IDE for on-chain and off-chain development.
            </h1>
            <p className="mt-4 text-base text-gray-400 max-w-xl">
              CS Code unifies templates, testing, and deployment flows for the main Cardano dApp lifecycle. Ship
              validators, integrate wallets, and push code to GitHub with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-terminal-green text-charcoal-dark font-semibold hover:bg-terminal-green/90 transition-colors"
              >
                Launch the IDE
                <ArrowRight size={16} />
              </button>
              <a
                href="#auth"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-charcoal-lighter text-gray-200 hover:border-amber/60 hover:text-amber transition-colors"
              >
                Connect account
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-xs text-gray-500 font-mono">
              <span>Plutus + Aiken ready</span>
              <span>Wallet flows included</span>
              <span>Production templates</span>
            </div>
          </div>

          <div className="bg-charcoal/60 border border-charcoal-lighter rounded-2xl p-6 shadow-xl shadow-black/30">
            <div className="flex items-center gap-3 mb-6">
              <TerminalSquare className="text-amber" />
              <div>
                <div className="text-sm font-mono text-gray-400">Workspace Preview</div>
                <div className="text-lg font-semibold text-gray-100">Main Cardano dApp Kit</div>
              </div>
            </div>
            <div className="space-y-4 text-sm text-gray-400 font-mono">
              <div className="flex items-center justify-between">
                <span>Validator scripts</span>
                <span className="text-terminal-green">ready</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Wallet connectors</span>
                <span className="text-terminal-green">linked</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Deployment network</span>
                <span className="text-amber">preprod</span>
              </div>
              <div className="border-t border-charcoal-lighter/60 pt-4 text-xs text-gray-500">
                Generated from curated starter templates with guided workflows.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-charcoal/70 border border-charcoal-lighter rounded-xl p-5">
            <Blocks className="text-terminal-blue mb-3" />
            <h3 className="font-semibold text-gray-100">On-chain + Off-chain</h3>
            <p className="mt-2 text-sm text-gray-400">
              Work on Plutus validators, off-chain logic, and wallet integrations inside one workspace.
            </p>
          </div>
          <div className="bg-charcoal/70 border border-charcoal-lighter rounded-xl p-5">
            <Workflow className="text-terminal-purple mb-3" />
            <h3 className="font-semibold text-gray-100">Guided workflows</h3>
            <p className="mt-2 text-sm text-gray-400">
              Follow opinionated paths for building, testing, and deploying production-ready Cardano dApps.
            </p>
          </div>
          <div className="bg-charcoal/70 border border-charcoal-lighter rounded-xl p-5">
            <ShieldCheck className="text-terminal-green mb-3" />
            <h3 className="font-semibold text-gray-100">Secure collaboration</h3>
            <p className="mt-2 text-sm text-gray-400">
              Authenticate with GitHub or Google to keep projects synced and versioned.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-12" id="auth">
        <div className="bg-charcoal/80 border border-charcoal-lighter rounded-2xl p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-100">Connect to save and ship your Cardano dApps</h2>
              <p className="mt-2 text-sm text-gray-400 max-w-xl">
                Sign in to keep your code always backed up, sync across devices, and push to GitHub in one click.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => onAuth('google')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors"
              >
                <Chrome size={18} />
                Continue with Google
              </button>
              <button
                onClick={() => onAuth('github')}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-charcoal-light border border-charcoal-lighter text-gray-200 font-semibold hover:border-amber/60 hover:text-amber transition-colors"
              >
                <Github size={18} />
                Continue with GitHub
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-8 pb-10 pt-4 text-xs text-gray-500 flex items-center justify-between">
        <span className="font-mono">CS Code • Cardano Studio</span>
        <button onClick={onGetStarted} className="text-amber hover:text-amber/80 transition-colors">
          Start building
        </button>
      </footer>
    </div>
  );
}
