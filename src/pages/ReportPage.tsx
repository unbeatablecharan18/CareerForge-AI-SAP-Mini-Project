/**
 * CareerForge AI - Final Interview Report
 * Comprehensive coaching evaluation with category breakdowns, discovered gaps,
 * previous interview score comparisons, and next-step recommendations.
 */
import React, { useState, useEffect } from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Download,
  Map,
  RotateCcw,
  Headphones,
  Briefcase,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../api.ts';
import { InterviewReport, InterviewSession, JobDescription } from '../types.ts';

interface ReportPageProps {
  onNavigate: (tab: string, extra?: any) => void;
  interviewId?: string;
}

export const ReportPage: React.FC<ReportPageProps> = ({ onNavigate, interviewId }) => {
  const [report, setReport] = useState<InterviewReport | null>(null);
  const [interview, setInterview] = useState<InterviewSession | null>(null);
  const [job, setJob] = useState<JobDescription | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        let targetId = interviewId;

        if (!targetId) {
          const listRes = await api.getInterviews();
          const completed = listRes.interviews.filter(i => i.status === 'completed');
          targetId = completed[completed.length - 1]?.id;
        }

        if (targetId) {
          const res = await api.getInterviewReport(targetId);
          setReport(res.report);
          setInterview(res.interview);
          setJob(res.job);
        }
      } catch (err) {
        console.error('Failed to load report:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReport();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center">
        <Sparkles className="w-10 h-10 text-cyan-400 animate-spin" />
        <h3 className="text-lg font-bold text-white">Generating Complete Coaching Report...</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Calculating programmatic weighted scores across accuracy, problem solving, and role relevance.
        </p>
      </div>
    );
  }

  if (!report || !interview) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <Award className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Interview Report Found</h3>
        <p className="text-xs text-slate-400">
          Complete a mock interview session to unlock your in-depth performance coaching report.
        </p>
        <button
          onClick={() => onNavigate('interview')}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
        >
          Start Mock Interview
        </button>
      </div>
    );
  }

  const rubricScores = [
    { label: 'Technical Accuracy (30%)', score: report.technicalAccuracyScore, color: 'bg-cyan-400' },
    { label: 'Problem Solving (25%)', score: report.problemSolvingScore, color: 'bg-indigo-500' },
    { label: 'Completeness (20%)', score: report.completenessScore, color: 'bg-emerald-400' },
    { label: 'Role Relevance (15%)', score: report.roleRelevanceScore, color: 'bg-amber-400' },
    { label: 'Communication (10%)', score: report.communicationScore, color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800/80 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Award className="w-3.5 h-3.5" /> Performance Report
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Interview Coaching Analysis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Target Role: <strong className="text-slate-200">{job?.title || 'Senior Software Engineer'}</strong> ({job?.company || 'Target Company'}).
          </p>
        </div>

        {/* Big Overall Score Pod */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 self-start md:self-auto">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Overall Score</div>
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-amber-300">
              {report.overallScore}
              <span className="text-lg text-slate-500 font-semibold">/100</span>
            </div>
          </div>

          {report.comparisonWithPrevious && (
            <div className="pl-4 border-l border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 uppercase block font-medium">Progression</span>
              <div className={`font-bold flex items-center gap-1 ${
                report.comparisonWithPrevious.scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{report.comparisonWithPrevious.scoreDelta >= 0 ? `+${report.comparisonWithPrevious.scoreDelta}` : report.comparisonWithPrevious.scoreDelta} pts</span>
              </div>
              <span className="text-[10px] text-slate-500">vs Previous Session</span>
            </div>
          )}
        </div>
      </div>

      {/* Rubric Category Breakdown Grid */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
        <h3 className="text-lg font-bold text-white tracking-tight mb-4">
          Deterministic Rubric Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {rubricScores.map(item => (
            <div key={item.label} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-xs font-semibold text-slate-300 block mb-1">{item.label}</span>
              <div className="text-xl font-extrabold text-white mb-2">{item.score}%</div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${Math.min(100, item.score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths vs Weaknesses vs Critical Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strong Areas */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Strong Areas
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.strongAreas.map((s, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weak Areas */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Needs Improvement
          </h4>
          <ul className="space-y-2 text-xs text-slate-300">
            {report.weakAreas.map((w, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Critical Gaps Discovered */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
          <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rose-400" /> Critical Role Gaps Discovered
          </h4>
          <div className="space-y-2">
            {report.criticalGapsDiscovered.length > 0 ? (
              report.criticalGapsDiscovered.map((g, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
                  {g}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No critical blockers discovered in this mock set.</p>
            )}
          </div>
        </div>
      </div>

      {/* QUESTION BY QUESTION AUDIT ACCORDION */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
        <h3 className="text-lg font-bold text-white tracking-tight mb-4">
          Question-by-Question Technical Coaching
        </h3>

        <div className="space-y-3">
          {interview.questions.map((q, idx) => {
            const ev = interview.evaluations[q.id];
            const ans = interview.answers[q.id];
            const isExpanded = expandedQuestionId === q.id;

            return (
              <div
                key={q.id}
                className="rounded-xl bg-slate-950/60 border border-slate-800 overflow-hidden"
              >
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-4 cursor-pointer flex items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                      Q{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{q.topic}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{q.questionText}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {ev && (
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        ev.weightedScore >= 80 ? 'bg-emerald-500/10 text-emerald-400' :
                        ev.weightedScore >= 65 ? 'bg-amber-500/10 text-amber-400' : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {ev.weightedScore}/100
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && ev && (
                  <div className="p-4 border-t border-slate-900 space-y-3 text-xs bg-slate-950/90 animate-in fade-in duration-150">
                    <div>
                      <span className="font-semibold text-slate-400 block mb-1">Your Submitted Answer:</span>
                      <p className="text-slate-200 bg-slate-900 p-2.5 rounded-lg border border-slate-800/80">
                        {ans || 'No response recorded.'}
                      </p>
                    </div>

                    {ev.technicalCorrection && (
                      <div>
                        <span className="font-semibold text-cyan-400 block mb-1">Technical Precision Note:</span>
                        <p className="text-slate-300">{ev.technicalCorrection}</p>
                      </div>
                    )}

                    {ev.betterAnswerStructure && (
                      <div className="p-3 rounded-lg bg-indigo-950/20 border border-indigo-900/30">
                        <span className="font-semibold text-indigo-300 block mb-1">Better Answer Structure:</span>
                        <p className="text-indigo-200/90">{ev.betterAnswerStructure}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Actions & Re-Interview Launch */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Ready for Continuous Improvement?</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-lg">
            Review your personalized multi-week roadmap or re-interview on your weak areas to measure actual skill gains.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('roadmap', { jobId: interview.jobId })}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Map className="w-3.5 h-3.5 text-amber-400" />
            <span>Open Personalized Roadmap</span>
          </button>
          <button
            onClick={() =>
              onNavigate('interview', {
                resumeId: interview.resumeId,
                jobId: interview.jobId,
                matchId: interview.matchId,
                mode: 'Skill-Gap Interview',
              })
            }
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30 flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Test Me Again (Re-Interview)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
