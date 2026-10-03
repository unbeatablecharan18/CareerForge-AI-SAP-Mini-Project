/**
 * CareerForge AI - Role Fit Visualization
 * Signature Comparison Visual comparing Candidate Profile versus Target Role.
 */
import React from 'react';
import { Target, CheckCircle2, AlertCircle, Compass, Award, Briefcase, GraduationCap } from 'lucide-react';
import { CompatibilityMatch } from '../types.ts';

interface RoleFitComparisonProps {
  match: CompatibilityMatch;
  targetRoleTitle?: string;
  className?: string;
}

export const RoleFitComparison: React.FC<RoleFitComparisonProps> = ({
  match,
  targetRoleTitle = 'Target Role',
  className = '',
}) => {
  const dimensions = [
    {
      label: 'Technical Skill Match',
      score: match.technicalScore,
      icon: Target,
      color: 'text-cyan-400 bg-cyan-400',
      description: 'Overlap across core languages, frameworks, and datastores.',
    },
    {
      label: 'Project Relevance',
      score: match.projectScore,
      icon: Briefcase,
      color: 'text-indigo-400 bg-indigo-500',
      description: 'Alignment between candidate portfolio and target responsibilities.',
    },
    {
      label: 'Experience Scope',
      score: match.experienceScore,
      icon: Award,
      color: 'text-amber-400 bg-amber-500',
      description: 'Years of production tenure, seniority, and scale of past systems.',
    },
    {
      label: 'Academic & Education',
      score: match.educationScore,
      icon: GraduationCap,
      color: 'text-emerald-400 bg-emerald-400',
      description: 'Relevant degree fundamentals, accredited background, or coursework.',
    },
    {
      label: 'Semantic Domain Synergy',
      score: match.semanticScore,
      icon: Compass,
      color: 'text-purple-400 bg-purple-500',
      description: 'Domain terminology and conceptual context alignment.',
    },
  ];

  return (
    <div className={`p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white tracking-tight">Role Fit Breakdown</h3>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Multi-Dimensional
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Explainable comparison of candidate background against {targetRoleTitle}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium uppercase">Overall Match</div>
            <div className="text-2xl font-extrabold text-white tracking-tight">{match.overallScore}%</div>
          </div>
        </div>
      </div>

      {/* Dimension Progress Bars */}
      <div className="space-y-4 mt-6">
        {dimensions.map(dim => {
          const Icon = dim.icon;
          return (
            <div key={dim.label} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/60">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="flex items-center gap-2 font-semibold text-slate-200">
                  <Icon className={`w-4 h-4 ${dim.color.split(' ')[0]}`} />
                  {dim.label}
                </span>
                <span className="font-bold text-slate-100">{dim.score}%</span>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">{dim.description}</p>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${dim.color.split(' ')[1]}`}
                  style={{ width: `${Math.min(100, Math.max(0, dim.score))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths vs Key Gaps comparison pills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800/80">
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Verified Strengths
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {match.strengths.map((s, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
          <h4 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400" /> Primary Skill Gaps to Bridge
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {match.weaknesses.map((w, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
