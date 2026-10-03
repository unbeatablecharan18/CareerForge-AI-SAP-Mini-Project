/**
 * CareerForge AI - Skill Universe
 * Signature Interactive Skill Galaxy and Gap Inspector.
 * Displays Strong, Partial, Not Demonstrated, and Required skills with evidence.
 */
import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles,
  ExternalLink,
  X
} from 'lucide-react';
import { SkillGapItem } from '../types.ts';

interface SkillUniverseProps {
  skills: SkillGapItem[];
  onStartPracticeInterview?: (skillName: string) => void;
  className?: string;
}

export const SkillUniverse: React.FC<SkillUniverseProps> = ({
  skills,
  onStartPracticeInterview,
  className = '',
}) => {
  const [filter, setFilter] = useState<'ALL' | 'STRONG' | 'PARTIAL' | 'NOT DEMONSTRATED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<SkillGapItem | null>(null);

  const filtered = skills.filter(item => {
    const matchesFilter = filter === 'ALL' || item.status === filter;
    const matchesSearch = item.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const strongCount = skills.filter(s => s.status === 'STRONG').length;
  const partialCount = skills.filter(s => s.status === 'PARTIAL').length;
  const gapCount = skills.filter(s => s.status === 'NOT DEMONSTRATED').length;

  const getStatusBadge = (status: SkillGapItem['status']) => {
    switch (status) {
      case 'STRONG':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Strong
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3" /> Partial
          </span>
        );
      case 'NOT DEMONSTRATED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" /> Not Demonstrated
          </span>
        );
    }
  };

  const getCardRingColor = (status: SkillGapItem['status']) => {
    switch (status) {
      case 'STRONG':
        return 'hover:border-emerald-500/60 hover:shadow-emerald-500/10';
      case 'PARTIAL':
        return 'hover:border-amber-500/60 hover:shadow-amber-500/10';
      case 'NOT DEMONSTRATED':
        return 'hover:border-rose-500/60 hover:shadow-rose-500/10';
    }
  };

  return (
    <div className={`p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl ${className}`}>
      {/* Header & Stats bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight">Skill Universe</h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Interactive Matrix
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Click any skill node to inspect verifiable resume evidence, target requirement, and interview questions.
          </p>
        </div>

        {/* Quick count badges */}
        <div className="flex items-center gap-2 text-xs font-medium">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            {strongCount} Strong
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            {partialCount} Partial
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            {gapCount} Missing / Gap
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80 w-full sm:w-auto">
          {(['ALL', 'STRONG', 'PARTIAL', 'NOT DEMONSTRATED'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === tab
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab === 'NOT DEMONSTRATED' ? 'Gaps' : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search skill or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
        {filtered.map(item => (
          <div
            key={item.skillName}
            onClick={() => setSelectedSkill(item)}
            className={`group cursor-pointer p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg ${getCardRingColor(
              item.status
            )}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">
                  {item.skillName}
                </h4>
                <span className="text-[11px] text-slate-400">{item.category}</span>
              </div>
              {getStatusBadge(item.status)}
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
              {item.gapExplanation || item.whyMatters}
            </p>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-900 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-[11px] text-indigo-400 font-medium group-hover:underline">
                Inspect Evidence <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
              <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${
                item.priority === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                item.priority === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {item.priority}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-950/30 rounded-xl border border-dashed border-slate-800">
            <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm font-medium">No skills match the current filter.</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the filter or search query.</p>
          </div>
        )}
      </div>

      {/* SKILL EVIDENCE & GAP INSPECTOR DRAWER / MODAL */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            {/* Close Button */}
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{selectedSkill.skillName}</h3>
                  {getStatusBadge(selectedSkill.status)}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                  <span>Category: <strong className="text-slate-200">{selectedSkill.category}</strong></span>
                  <span>•</span>
                  <span>Priority: <strong className="text-amber-400">{selectedSkill.priority}</strong></span>
                </div>
              </div>
            </div>

            {/* Why this skill matters */}
            <div className="mt-5 p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200">
              <span className="font-semibold text-indigo-300 block mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Why this skill matters for the role:
              </span>
              {selectedSkill.whyMatters}
            </div>

            {/* Two-Column Comparison: Job Requirement vs Resume Evidence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" /> Target Job Requirement
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedSkill.jobRequirement || 'Required as core competence for the target position.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Verifiable Resume Evidence
                </h5>
                <p className={`text-xs leading-relaxed ${
                  selectedSkill.status === 'STRONG' ? 'text-emerald-300' :
                  selectedSkill.status === 'PARTIAL' ? 'text-amber-300' : 'text-slate-400 italic'
                }`}>
                  "{selectedSkill.evidence}"
                </p>
              </div>
            </div>

            {/* Gap Analysis */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
              <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Honest Gap Analysis
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedSkill.gapExplanation}
              </p>
            </div>

            {/* Learning Recommendation */}
            {selectedSkill.learningAction && (
              <div className="mt-4 p-4 rounded-xl bg-cyan-950/20 border border-cyan-900/40 text-xs text-cyan-200">
                <span className="font-semibold text-cyan-300 block mb-1">
                  Recommended Learning Action:
                </span>
                {selectedSkill.learningAction}
              </div>
            )}

            {/* Sample Interview Questions for this skill */}
            {selectedSkill.interviewQuestions && selectedSkill.interviewQuestions.length > 0 && (
              <div className="mt-5">
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Sample Interview Probes for this Skill:
                </h5>
                <div className="space-y-2">
                  {selectedSkill.interviewQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300">
                      <strong className="text-indigo-400 mr-1.5">Q{idx + 1}:</strong> {q}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-slate-800">
              <button
                onClick={() => setSelectedSkill(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Close Inspector
              </button>
              {onStartPracticeInterview && (
                <button
                  onClick={() => {
                    const skill = selectedSkill.skillName;
                    setSelectedSkill(null);
                    onStartPracticeInterview(skill);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Practice Skill Interview
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
