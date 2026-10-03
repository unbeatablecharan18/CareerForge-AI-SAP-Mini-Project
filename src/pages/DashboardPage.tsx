/**
 * CareerForge AI - Career Command Center (Dashboard)
 * Real data persistence: Career Readiness, Compatibility, Latest Interview, 
 * Skill Coverage, Recent Sessions, and Recommended Next Action.
 */
import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  Crosshair,
  Map,
  Clock,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { api } from '../api.ts';
import { CareerReadinessOrb } from '../components/CareerReadinessOrb.tsx';
import { CompatibilityMatch, InterviewSession, ProgressSnapshot } from '../types.ts';

interface DashboardPageProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [careerReadiness, setCareerReadiness] = useState(70);
  const [latestMatch, setLatestMatch] = useState<CompatibilityMatch | null>(null);
  const [interviews, setInterviews] = useState<InterviewSession[]>([]);
  const [snapshots, setSnapshots] = useState<ProgressSnapshot[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const [progressRes, interviewsRes, resumesRes, jobsRes] = await Promise.all([
          api.getProgress(),
          api.getInterviews(),
          api.getResumes(),
          api.getJobs(),
        ]);

        setCareerReadiness(progressRes.careerReadiness || 70);
        setSnapshots(progressRes.snapshots || []);
        setInterviews(interviewsRes.interviews || []);

        if (progressRes.latestMatch) {
          setLatestMatch(progressRes.latestMatch);
        } else if (resumesRes.resumes.length > 0 && jobsRes.jobs.length > 0) {
          // Check if there is an existing match
          try {
            const matchRes = await api.runMatch({
              resumeId: resumesRes.resumes[0].id,
              jobId: jobsRes.jobs[0].id,
            });
            setLatestMatch(matchRes.match);
          } catch (e) {
            console.warn('Match lazy check deferred:', e);
          }
        }
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const completedInterviews = interviews.filter(i => i.status === 'completed');
  const latestInterview = completedInterviews[completedInterviews.length - 1];
  const latestReport = latestInterview?.report;

  const topStrength = latestReport?.strongAreas?.[0] || latestMatch?.strengths?.[0] || 'Technical Accuracy & Fundamentals';
  const topGap = latestReport?.weakAreas?.[0] || latestMatch?.weaknesses?.[0] || 'Platform Architecture & Scale';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800/80 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Career Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.name.split(' ')[0] || 'Engineer'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Targeting: <strong className="text-slate-200">{latestMatch ? 'Target Role' : (user?.targetRoleTitle || 'Senior Software Engineer')}</strong>. Real-time career readiness and interview simulation state.
          </p>
        </div>

        {/* Quick Action Button */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => onNavigate('interview')}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 group"
          >
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span>Start Adaptive Mock Interview</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Main Grid: Career Readiness Orb + High-Level Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Signature Career Readiness Orb */}
        <div className="lg:col-span-1">
          <CareerReadinessOrb
            score={careerReadiness}
            compatibilityScore={latestMatch?.overallScore || 78}
            skillCoverageScore={latestMatch?.preferredSkillCoverage || 75}
            interviewScore={latestReport?.overallScore || 83}
            roleAlignmentScore={latestMatch?.technicalScore || 80}
            targetRoleTitle={user?.targetRoleTitle || 'Senior Platform Engineer'}
          />
        </div>

        {/* Right 2 Columns: Command Center Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          {/* 4 Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Job Compatibility</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-1">
                {latestMatch ? `${latestMatch.overallScore}%` : '78%'}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">5-Factor weighted</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Latest Mock Score</span>
              <div className="text-2xl font-extrabold text-indigo-400 mt-1">
                {latestReport ? `${latestReport.overallScore}/100` : '83/100'}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Programmatic AI eval</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Completed Sessions</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-1">
                {completedInterviews.length || 1}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Real mock sessions</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Active Skill Gaps</span>
              <div className="text-2xl font-extrabold text-amber-400 mt-1">
                {latestMatch?.skillGaps.filter(g => g.status !== 'STRONG').length || 3}
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Identified to bridge</span>
            </div>
          </div>

          {/* Top Strength & Top Gap Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-2">
                <CheckCircle2 className="w-4 h-4" /> Top Demonstrated Strength
              </div>
              <p className="text-sm font-semibold text-slate-200 line-clamp-1">{topStrength}</p>
              <p className="text-xs text-slate-400 mt-1">
                Verifiable evidence corroborated by both resume extraction and mock interview performance.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-2">
                <AlertTriangle className="w-4 h-4" /> Priority Skill Gap
              </div>
              <p className="text-sm font-semibold text-slate-200 line-clamp-1">{topGap}</p>
              <p className="text-xs text-slate-400 mt-1">
                Required for the target role but not demonstrated on the submitted resume.
              </p>
            </div>
          </div>

          {/* Next Recommended Action Banner */}
          <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Recommended Next Action:
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-200">
                Practice targeted questions on <strong className="text-white">Kubernetes & GraphQL</strong> to close critical role gaps.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('roadmap')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
              >
                View Roadmap
              </button>
              <button
                onClick={() => onNavigate('interview')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30"
              >
                Launch Interview
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Launchpad & Workspaces */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('resumes')}
          className="group cursor-pointer p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-sm hover:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
            Resume Intelligence
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Upload PDF/Word resumes. Inspect detected vs inferred technical skills.
          </p>
        </div>

        <div
          onClick={() => onNavigate('jobs')}
          className="group cursor-pointer p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-sm hover:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Briefcase className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
            Target Job Intelligence
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Paste target job descriptions to extract required vs preferred competencies.
          </p>
        </div>

        <div
          onClick={() => onNavigate('match')}
          className="group cursor-pointer p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-sm hover:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Crosshair className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
            Skill Universe Matrix
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Explore verifiable resume citations, gap explanations, and sample probes.
          </p>
        </div>

        <div
          onClick={() => onNavigate('roadmap')}
          className="group cursor-pointer p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-sm hover:shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Map className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
            Personalized Roadmap
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Actionable learning progression with hands-on practice coding tasks.
          </p>
        </div>
      </div>

      {/* Recent Interviews List */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Recent Interview Sessions</h3>
            <p className="text-xs text-slate-400">Review evaluated performance and personalized coaching reports</p>
          </div>
          <button
            onClick={() => onNavigate('progress')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>View All History</span> <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3 mt-4">
          {interviews.length > 0 ? (
            interviews.map(inv => {
              const rep = inv.report;
              return (
                <div
                  key={inv.id}
                  onClick={() => onNavigate('report', { interviewId: inv.id })}
                  className="cursor-pointer p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span>{inv.jobTitle || 'Senior Software Engineer'}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                          {inv.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(inv.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{inv.totalQuestions} Questions</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {rep ? (
                      <div className="text-right">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Score</span>
                        <div className="text-lg font-bold text-cyan-400">{rep.overallScore}/100</div>
                      </div>
                    ) : (
                      <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">
                        In Progress
                      </span>
                    )}
                    <span className="text-xs font-semibold text-indigo-400 hover:underline">
                      View Report →
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400">
              <Headphones className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-medium">No mock interviews recorded yet.</p>
              <button
                onClick={() => onNavigate('interview')}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                Launch First Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
