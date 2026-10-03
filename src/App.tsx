/**
 * CareerForge AI - Main Application Component
 * "Prepare for the job you actually want."
 */
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { ResumesPage } from './pages/ResumesPage.tsx';
import { JobsPage } from './pages/JobsPage.tsx';
import { MatchPage } from './pages/MatchPage.tsx';
import { InterviewRoomPage } from './pages/InterviewRoomPage.tsx';
import { ReportPage } from './pages/ReportPage.tsx';
import { RoadmapPage } from './pages/RoadmapPage.tsx';
import { ProgressPage } from './pages/ProgressPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { SecurityAuditPage } from './pages/SecurityAuditPage.tsx';
import { AuthModal } from './pages/AuthModal.tsx';
import { Sparkles, Shield, Github, Heart } from 'lucide-react';

function AppContent() {
  const { user, login, openAuthModal } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [navigationParams, setNavigationParams] = useState<any>({});

  const handleNavigate = (tab: string, params: any = {}) => {
    setNavigationParams(params);
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExploreDemo = async () => {
    try {
      await login('candidate@careerforge.ai', 'Candidate@2026!');
      setCurrentTab('dashboard');
    } catch {
      openAuthModal('login');
    }
  };

  const renderActivePage = () => {
    // If not authenticated and on landing page or requested landing
    if (!user && currentTab === 'landing') {
      return (
        <LandingPage
          onGetStarted={() => openAuthModal('register')}
          onExploreDemo={handleExploreDemo}
        />
      );
    }

    if (!user) {
      // Default to landing page when unauthenticated
      return (
        <LandingPage
          onGetStarted={() => openAuthModal('register')}
          onExploreDemo={handleExploreDemo}
        />
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'resumes':
        return <ResumesPage onNavigate={handleNavigate} />;
      case 'jobs':
        return <JobsPage onNavigate={handleNavigate} />;
      case 'match':
        return (
          <MatchPage
            onNavigate={handleNavigate}
            initialResumeId={navigationParams.resumeId}
            initialJobId={navigationParams.jobId}
          />
        );
      case 'interview':
        return (
          <InterviewRoomPage
            onNavigate={handleNavigate}
            initialInterviewId={navigationParams.interviewId}
            resumeId={navigationParams.resumeId}
            jobId={navigationParams.jobId}
            matchId={navigationParams.matchId}
            mode={navigationParams.mode}
          />
        );
      case 'report':
        return (
          <ReportPage
            onNavigate={handleNavigate}
            interviewId={navigationParams.interviewId}
          />
        );
      case 'roadmap':
        return (
          <RoadmapPage
            onNavigate={handleNavigate}
            jobId={navigationParams.jobId}
          />
        );
      case 'progress':
        return <ProgressPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPage />;
      case 'security':
        return <SecurityAuditPage />;
      case 'landing':
        return (
          <LandingPage
            onGetStarted={() => openAuthModal('register')}
            onExploreDemo={handleExploreDemo}
          />
        );
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050811] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Primary Navigation */}
      <Navbar currentTab={currentTab} onSelectTab={tab => handleNavigate(tab)} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">{renderActivePage()}</main>

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-3 h-3" />
            </div>
            <span className="font-bold text-slate-200">CareerForge AI</span>
            <span>—</span>
            <span className="italic">"Prepare for the job you actually want."</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => handleNavigate('security')}
              className="hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> Security & IDOR Audits
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavigate('dashboard')}
              className="hover:text-slate-200 transition-colors"
            >
              Command Center
            </button>
            <span>•</span>
            <button
              onClick={() => handleNavigate('landing')}
              className="hover:text-slate-200 transition-colors"
            >
              Overview
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
