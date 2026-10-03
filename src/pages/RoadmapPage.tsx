/**
 * CareerForge AI - Personalized Preparation Roadmap
 * Target-role tailored multi-week progression targeting identified skill gaps
 * with hands-on practice tasks and sample interview self-tests.
 */
import React, { useState, useEffect } from 'react';
import {
  Map,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Calendar,
  BookOpen,
  Terminal,
  Headphones,
  RotateCcw,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../api.ts';
import { LearningRoadmap, JobDescription } from '../types.ts';

interface RoadmapPageProps {
  onNavigate: (tab: string, extra?: any) => void;
  jobId?: string;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onNavigate, jobId }) => {
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(jobId || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoadmaps() {
      try {
        setLoading(true);
        const jobsRes = await api.getJobs();
        setJobs(jobsRes.jobs);

        const targetJobId = jobId || (jobsRes.jobs[0]?.id ?? '');
        setSelectedJobId(targetJobId);

        if (targetJobId) {
          const res = await api.getRoadmap(targetJobId);
          setRoadmap(res.roadmap);
        }
      } catch (err) {
        console.error('Failed to load roadmap:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmaps();
  }, [jobId]);

  const handleSelectJob = async (jId: string) => {
    setSelectedJobId(jId);
    setLoading(true);
    try {
      const res = await api.getRoadmap(jId);
      setRoadmap(res.roadmap);
    } catch (e) {
      console.warn('Error loading roadmap:', e);
    } finally {
      setLoading(false);
    }
  };

  const activeJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personalized Learning Roadmap
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Gap-Targeted
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Structured multi-week milestone plan targeting identified gaps without fabricating false experience.
          </p>
        </div>

        {/* Target Job Selector */}
        {jobs.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Target Role:</span>
            <select
              value={selectedJobId}
              onChange={e => handleSelectJob(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {jobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.company})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading personalized preparation milestones...</p>
        </div>
      ) : roadmap ? (
        <div className="space-y-8">
          {/* Roadmap Overview Banner */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Estimated Duration: {roadmap.estimatedWeeks} Weeks
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight mt-1">{roadmap.title}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Targeting: {activeJob?.title || 'Target Role'} ({activeJob?.company || 'Company'})
              </p>
            </div>

            <button
              onClick={() => onNavigate('interview', { jobId: selectedJobId, mode: 'Skill-Gap Interview' })}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2 shrink-0 self-start md:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Launch Practice Interview</span>
            </button>
          </div>

          {/* Weekly Milestones Progression */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
            <h3 className="text-base font-bold text-white tracking-tight mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" /> Multi-Week Milestone Progression
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {roadmap.milestones.map((ms, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-cyan-400">Week {ms.week}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">Milestone</span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-2">{ms.title}</h4>
                    <p className="text-[11px] text-slate-400 mb-3">{ms.deliverable}</p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-900">
                    {ms.skillsCovered.map((s, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Skill Focus Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Targeted Skill Priorities & Tasks
            </h3>

            {roadmap.priorities.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold text-xs flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <h4 className="text-base font-bold text-white">{item.skill}</h4>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full self-start sm:self-auto ${
                    item.priority === 'CRITICAL' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {item.priority} PRIORITY
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-slate-400 block mb-1">Why It Matters:</span>
                    <p className="text-slate-300">{item.whyMatters}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="font-semibold text-cyan-400 block mb-1">Target Capability Milestone:</span>
                    <p className="text-slate-300">{item.targetMilestone}</p>
                  </div>
                </div>

                {/* Practical Building Task */}
                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-300 mb-1">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>Hands-On Practice Task:</span>
                  </div>
                  <p className="text-slate-200">{item.practiceTask}</p>
                </div>

                {/* Interview Self-Test Question */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                    <Headphones className="w-4 h-4 text-amber-400" />
                    <span>Self-Check Interview Question:</span>
                  </div>
                  <p className="text-slate-300 italic">"{item.interviewPracticeQuestion}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <Map className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No Learning Roadmap Generated Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Complete a mock interview or run a compatibility match to automatically generate your personalized career preparation roadmap.
          </p>
          <button
            onClick={() => onNavigate('interview')}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
          >
            Launch Interview to Generate Roadmap
          </button>
        </div>
      )}
    </div>
  );
};
