/**
 * CareerForge AI - Signature Public Landing Page
 * "Prepare for the job you actually want."
 */
import React from 'react';
import {
  Sparkles,
  Shield,
  ArrowRight,
  Crosshair,
  Headphones,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Lock,
  ChevronRight,
  Target,
  Layers,
  Database
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onExploreDemo }) => {
  const { openAuthModal } = useAuth();

  return (
    <div className="relative overflow-hidden pt-8 pb-20">
      {/* Background glow orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-indigo-600/20 via-cyan-500/20 to-amber-500/10 blur-[130px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 mb-6 backdrop-blur-md shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-semibold text-white">CareerForge AI</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Targeted Technical Interview & Skill Gap Simulator</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Prepare for the job you <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-amber-300">
            actually want.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Upload your real resume and target job description. CareerForge AI analyzes verified evidence, maps your skill gaps, generates an adaptive technical mock interview, and builds a personalized progression roadmap.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onGetStarted}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            Start Targeted Evaluation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-center gap-2"
          >
            Launch Instant Demo (Alex Rivera)
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Value metrics ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 pt-10 border-t border-slate-800/60 max-w-4xl mx-auto">
          <div className="text-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <div className="text-2xl font-bold text-white tracking-tight">100%</div>
            <div className="text-xs text-slate-400 mt-0.5">Real AI Evaluations</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <div className="text-2xl font-bold text-cyan-400 tracking-tight">5-Factor</div>
            <div className="text-xs text-slate-400 mt-0.5">Explainable Match Score</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <div className="text-2xl font-bold text-indigo-400 tracking-tight">Adaptive</div>
            <div className="text-xs text-slate-400 mt-0.5">Interview Difficulty Tuning</div>
          </div>
          <div className="text-center p-3 rounded-xl bg-slate-900/40 border border-slate-800/40">
            <div className="text-2xl font-bold text-amber-400 tracking-tight">Zero-Fake</div>
            <div className="text-xs text-slate-400 mt-0.5">Strict Evidence Citation</div>
          </div>
        </div>
      </section>

      {/* CORE WORKFLOW LOOP SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            The Continuous Career Mastery Loop
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every operation is verified with real Gemini models and persistent database records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Crosshair className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Real Evidence & Gaps</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              We extract verified technical capabilities directly from your resume and compare them to the target job description. Gaps are categorized as Strong, Partial, or Not Demonstrated with exact resume citations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Adaptive Mock Interview</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Experience an immersive technical interview tailored to your gaps. If you struggle, the interviewer probes foundational intuition; if you excel, questions escalate to high-scale architecture and distributed trade-offs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Report, Roadmap & Re-Interview</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Receive a deterministic evaluation across Technical Accuracy, Problem Solving, and Communication. Follow a multi-week roadmap, then launch "Test Me Again" to verify actual score progression.
            </p>
          </div>
        </div>
      </section>

      {/* SIGNATURE FEATURES SHOWCASE */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
                <Target className="w-3.5 h-3.5" /> Signature Component System
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Career Readiness Orb & Skill Universe
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-3 leading-relaxed">
                CareerForge AI is built with original signature visualizations:
              </p>
              <ul className="space-y-3 mt-5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Career Readiness Orb:</strong> Synthesizes Compatibility, Interview Score, Skill Coverage, and Role Alignment into a live holographic visual.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong>Skill Universe Matrix:</strong> Clickable galaxy of target competencies with verifiable resume citations and gap explanations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Immersive AI Interview Room:</strong> Supports TTS audio voice output, microphone input, and an interactive coding sandbox runner.</span>
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={onGetStarted}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Create Your Account
                </button>
              </div>
            </div>

            {/* Visual Callout Graphic */}
            <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs font-mono space-y-3">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-900">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Cpu className="w-3.5 h-3.5" /> Live Simulation Engine
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Operational</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300">
                <div className="text-slate-400 text-[11px] mb-1">Target Role:</div>
                <div className="text-white font-semibold">Senior Full-Stack Engineer (Platform & APIs)</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Compatibility Score</div>
                  <div className="text-lg font-bold text-cyan-400">78%</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">Mock Interview</div>
                  <div className="text-lg font-bold text-indigo-400">83/100</div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-slate-400 text-[10px] mb-1">Targeted Gap Probes:</div>
                <div className="text-xs text-amber-300">Kubernetes Ingress • Kafka Partition Keys • GraphQL Resolvers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECURITY & DATA ISOLATION ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400 mb-3">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Security & Data Isolation Built-In</span>
        </div>
        <h3 className="text-xl font-bold text-white tracking-tight">
          Protected from Day One
        </h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
          Bcrypt password hashing, secure session management, strict IDOR ownership checks on every endpoint, and prompt injection bounds.
        </p>
      </section>
    </div>
  );
};
