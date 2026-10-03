/**
 * CareerForge AI - Target Job Description Intelligence
 * Paste real job postings, extract structured role requirements with Gemini,
 * and manage multiple target career goals.
 */
import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Target,
  ArrowRight,
  X,
  FileCheck
} from 'lucide-react';
import { api } from '../api.ts';
import { JobDescription, JobProfile } from '../types.ts';

interface JobsPageProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const JobsPage: React.FC<JobsPageProps> = ({ onNavigate }) => {
  const [jobs, setJobs] = useState<Array<JobDescription & { profile?: JobProfile }>>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await api.getJobs();
      setJobs(res.jobs);
      if (res.jobs.length > 0 && !selectedJobId) {
        setSelectedJobId(res.jobs[0].id);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const activeJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const activeProfile = activeJob?.profile;

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim() || rawText.trim().length < 20) {
      setError('Please provide a substantive job description (at least 20 characters).');
      return;
    }

    setCreating(true);
    setError(null);

    try {
      const res = await api.createJob({
        title,
        company,
        location,
        rawText,
      });

      setCreateModalOpen(false);
      setTitle('');
      setCompany('');
      setLocation('');
      setRawText('');
      await loadJobs();
      setSelectedJobId(res.job.id);
    } catch (err) {
      setError((err as Error).message || 'Failed to analyze job description.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this target job?')) return;
    try {
      await api.deleteJob(id);
      await loadJobs();
      if (selectedJobId === id) {
        setSelectedJobId(null);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to delete job.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Target Job Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Role Extraction
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyze real job postings to extract required vs preferred competencies and architectural expectations.
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Job Description</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Target Jobs Selector Tabs */}
      {jobs.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {jobs.map(j => (
            <button
              key={j.id}
              onClick={() => setSelectedJobId(j.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all shrink-0 ${
                activeJob?.id === j.id
                  ? 'bg-slate-900 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              <span className="truncate max-w-[200px] font-semibold">{j.title}</span>
              <span className="text-[10px] text-slate-500">({j.company})</span>
              {activeJob?.id === j.id && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-1" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Active Job Profile Workspace */}
      {activeJob && activeProfile ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white tracking-tight">{activeJob.title}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {activeProfile.seniority} Level
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>Company: <strong className="text-slate-200">{activeJob.company}</strong></span>
                {activeJob.location && <span>Location: <strong className="text-slate-200">{activeJob.location}</strong></span>}
                {activeProfile.experienceRequirements && (
                  <span>Experience: <strong className="text-slate-200">{activeProfile.experienceRequirements}</strong></span>
                )}
                {activeProfile.educationRequirements && (
                  <span>Education: <strong className="text-slate-200">{activeProfile.educationRequirements}</strong></span>
                )}
              </div>

              {/* Domain Knowledge Tags */}
              {activeProfile.domainKnowledge && activeProfile.domainKnowledge.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-3">
                  <span className="text-xs text-slate-400 mr-1">Domain Focus:</span>
                  {activeProfile.domainKnowledge.map((d, idx) => (
                    <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions on Active Job */}
            <div className="flex flex-row md:flex-col gap-2 shrink-0">
              <button
                onClick={() => onNavigate('match', { jobId: activeJob.id })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Match Compatibility
              </button>
              <button
                onClick={() => handleDeleteJob(activeJob.id)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Job
              </button>
            </div>
          </div>

          {/* Required vs Preferred Skills Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Required Skills (Must-Have) */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">Required Skills (Must-Have)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Critical
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{activeProfile.requiredSkills.length} competencies</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeProfile.requiredSkills.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-100 block">{s.name}</span>
                      <span className="text-[10px] text-slate-500">{s.category}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {s.importance}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferred Skills (Nice-to-Have) */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-tight">Preferred Skills (Bonus)</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Advantage
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">{activeProfile.preferredSkills.length} competencies</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeProfile.preferredSkills.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-100 block">{s.name}</span>
                      <span className="text-[10px] text-slate-500">{s.category}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                      {s.importance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Responsibilities & Qualifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
              <h3 className="text-base font-bold text-white tracking-tight mb-3">
                Key Responsibilities
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeProfile.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
              <h3 className="text-base font-bold text-white tracking-tight mb-3">
                Role Qualifications
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {activeProfile.qualifications.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No Target Role Saved Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Paste a job description to extract core competencies, responsibilities, and analyze your candidate compatibility.
          </p>
          <button
            onClick={() => setCreateModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Add Target Job
          </button>
        </div>
      )}

      {/* CREATE JOB MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Add Target Job Posting</h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste the job posting description. Gemini will extract required vs preferred skills, seniority, and qualifications.
            </p>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Backend Engineer"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Stripe, Netflix, Google"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Remote / San Francisco"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Job Posting Text</label>
                <textarea
                  required
                  rows={10}
                  placeholder="Paste the full job posting requirements and responsibilities here..."
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || !rawText.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/30"
                >
                  {creating ? 'Extracting with AI...' : 'Analyze Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
