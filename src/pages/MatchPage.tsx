/**
 * CareerForge AI - Compatibility & Skill Universe Workspace
 * Hybrid matching engine comparing candidate evidence against job expectations,
 * with interactive Skill Universe, Role Fit visualization, and ATS analysis.
 */
import React, { useState, useEffect } from 'react';
import {
  Crosshair,
  Sparkles,
  ArrowRight,
  Headphones,
  RotateCcw,
  AlertCircle,
  FileText,
  Briefcase,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { api } from '../api.ts';
import { Resume, JobDescription, CompatibilityMatch } from '../types.ts';
import { SkillUniverse } from '../components/SkillUniverse.tsx';
import { RoleFitComparison } from '../components/RoleFitComparison.tsx';
import { ATSAnalysisCard } from '../components/ATSAnalysisCard.tsx';

interface MatchPageProps {
  onNavigate: (tab: string, extra?: any) => void;
  initialResumeId?: string;
  initialJobId?: string;
}

export const MatchPage: React.FC<MatchPageProps> = ({
  onNavigate,
  initialResumeId,
  initialJobId,
}) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>(initialResumeId || '');
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId || '');
  const [match, setMatch] = useState<CompatibilityMatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [resumesRes, jobsRes, progressRes] = await Promise.all([
          api.getResumes(),
          api.getJobs(),
          api.getProgress(),
        ]);

        setResumes(resumesRes.resumes);
        setJobs(jobsRes.jobs);

        const rId = initialResumeId || (resumesRes.resumes[0]?.id ?? '');
        const jId = initialJobId || (jobsRes.jobs[0]?.id ?? '');

        setSelectedResumeId(rId);
        setSelectedJobId(jId);

        if (progressRes.latestMatch) {
          setMatch(progressRes.latestMatch);
        } else if (rId && jId) {
          runCalculation(rId, jId);
        }
      } catch (err) {
        console.error('Failed to initialize match page:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialResumeId, initialJobId]);

  const runCalculation = async (resumeId: string, jobId: string) => {
    if (!resumeId || !jobId) return;
    setCalculating(true);
    setError(null);

    try {
      const res = await api.runMatch({ resumeId, jobId });
      setMatch(res.match);
    } catch (err) {
      setError((err as Error).message || 'Failed to compute compatibility analysis.');
    } finally {
      setCalculating(false);
    }
  };

  const handleRecalculate = () => {
    if (selectedResumeId && selectedJobId) {
      runCalculation(selectedResumeId, selectedJobId);
    }
  };

  const activeJob = jobs.find(j => j.id === selectedJobId);
  const activeResume = resumes.find(r => r.id === selectedResumeId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Job Compatibility & Skill Universe
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Explainable Alignment
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Hybrid exact, normalized, and semantic analysis comparing candidate evidence to target role requirements.
          </p>
        </div>

        {/* Action Button */}
        {match && (
          <button
            onClick={() =>
              onNavigate('interview', {
                resumeId: selectedResumeId,
                jobId: selectedJobId,
                matchId: match.id,
              })
            }
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 self-start sm:self-auto group"
          >
            <Headphones className="w-4 h-4 text-cyan-400" />
            <span>Launch Personalized Interview</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Target Selector Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Resume Picker */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
            <div className="text-xs text-slate-400 shrink-0">Resume:</div>
            <select
              value={selectedResumeId}
              onChange={e => {
                setSelectedResumeId(e.target.value);
                runCalculation(e.target.value, selectedJobId);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-56"
            >
              {resumes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.originalName}
                </option>
              ))}
            </select>
          </div>

          {/* Job Picker */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Briefcase className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="text-xs text-slate-400 shrink-0">Target Job:</div>
            <select
              value={selectedJobId}
              onChange={e => {
                setSelectedJobId(e.target.value);
                runCalculation(selectedResumeId, e.target.value);
              }}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleRecalculate}
          disabled={calculating}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors flex items-center gap-1.5 self-end md:self-auto shrink-0"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${calculating ? 'animate-spin' : ''}`} />
          <span>{calculating ? 'Analyzing...' : 'Recalculate Match'}</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Calculating indicator */}
      {calculating && (
        <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-900 text-indigo-200 text-xs flex items-center gap-3 animate-pulse">
          <Sparkles className="w-6 h-6 text-cyan-400 animate-spin" />
          <div>
            <div className="text-sm font-semibold text-white">Mapping skills and evidence to target role...</div>
            <div className="text-indigo-300/80 text-xs mt-0.5">
              Evaluating exact matches, normalized taxonomy, project depth, and verifiable resume evidence.
            </div>
          </div>
        </div>
      )}

      {/* Match Content */}
      {match ? (
        <div className="space-y-8">
          {/* Main Visuals: Role Fit Breakdown + ATS Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RoleFitComparison
                match={match}
                targetRoleTitle={activeJob?.title || 'Target Role'}
              />
            </div>

            <div className="lg:col-span-1">
              <ATSAnalysisCard atsData={match.atsAnalysis} />
            </div>
          </div>

          {/* Interactive Skill Universe */}
          <SkillUniverse
            skills={match.skillGaps}
            onStartPracticeInterview={skillName => {
              onNavigate('interview', {
                resumeId: selectedResumeId,
                jobId: selectedJobId,
                matchId: match.id,
                targetedSkill: skillName,
                mode: 'Skill-Gap Interview',
              });
            }}
          />
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <Crosshair className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No Compatibility Match Run Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Select a candidate resume and target job above to map competencies and discover your verifiable skill gaps.
          </p>
        </div>
      )}
    </div>
  );
};
