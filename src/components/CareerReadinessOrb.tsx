/**
 * CareerForge AI - Career Readiness Orb
 * Signature Visualization synthesizing Job Compatibility, Skill Coverage, 
 * Interview Performance, and Role Alignment from real database data.
 */
import React from 'react';
import { Sparkles, ShieldCheck, Flame, TrendingUp } from 'lucide-react';

interface CareerReadinessOrbProps {
  score: number; // 0 - 100
  compatibilityScore: number;
  skillCoverageScore: number;
  interviewScore: number;
  roleAlignmentScore: number;
  targetRoleTitle?: string;
  className?: string;
}

export const CareerReadinessOrb: React.FC<CareerReadinessOrbProps> = ({
  score,
  compatibilityScore,
  skillCoverageScore,
  interviewScore,
  roleAlignmentScore,
  targetRoleTitle = 'Target Role',
  className = '',
}) => {
  // Normalize score between 0 and 100
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  // SVG calculations for concentric rings
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  const innerRadius = 72;
  const innerCircumference = 2 * Math.PI * innerRadius;
  const innerDashoffset = innerCircumference - ((compatibilityScore || 65) / 100) * innerCircumference;

  // Status tiers
  let tierLabel = 'Preparing';
  let tierColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  let glowColor = 'rgba(245, 158, 11, 0.4)';

  if (normalized >= 85) {
    tierLabel = 'Interview Ready';
    tierColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    glowColor = 'rgba(16, 185, 129, 0.5)';
  } else if (normalized >= 70) {
    tierLabel = 'Nearing Alignment';
    tierColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    glowColor = 'rgba(6, 182, 212, 0.5)';
  } else {
    tierLabel = 'Targeting Gaps';
    tierColor = 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    glowColor = 'rgba(99, 102, 241, 0.5)';
  }

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800/80 shadow-2xl backdrop-blur-xl ${className}`}>
      {/* Background ambient glow */}
      <div
        className="absolute w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none transition-all duration-700"
        style={{ backgroundColor: glowColor }}
      />

      <div className="relative flex items-center justify-center w-56 h-56">
        {/* SVG Concentric Gauge */}
        <svg className="w-56 h-56 -rotate-90 transform" viewBox="0 0 220 220">
          <defs>
            <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="innerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Outer Track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            className="stroke-slate-800/50"
            strokeWidth="10"
            fill="transparent"
          />

          {/* Outer Value Arc */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            stroke="url(#orbGradient)"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />

          {/* Inner Track (Compatibility) */}
          <circle
            cx="110"
            cy="110"
            r={innerRadius}
            className="stroke-slate-800/30"
            strokeWidth="4"
            fill="transparent"
          />

          {/* Inner Value Arc */}
          <circle
            cx="110"
            cy="110"
            r={innerRadius}
            stroke="url(#innerGradient)"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={innerCircumference}
            strokeDashoffset={innerDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Hologram Hub */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <div className="flex items-center gap-1 text-slate-400 text-xs font-medium uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
            Readiness
          </div>
          <div className="text-4xl font-extrabold text-white tracking-tight flex items-baseline">
            {normalized}
            <span className="text-lg text-slate-400 font-medium ml-0.5">/100</span>
          </div>
          <div className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${tierColor}`}>
            {tierLabel}
          </div>
        </div>
      </div>

      {/* Target Role Sub-caption */}
      <div className="mt-4 text-center">
        <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">{targetRoleTitle}</h4>
        <p className="text-xs text-slate-400 mt-0.5">Calculated from verified evidence & mock performance</p>
      </div>

      {/* Breakdown Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 w-full mt-5 pt-4 border-t border-slate-800/60">
        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
              Compatibility
            </span>
            <span className="font-semibold text-slate-200">{compatibilityScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, compatibilityScore)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-indigo-400" />
              Interview Score
            </span>
            <span className="font-semibold text-slate-200">{interviewScore || '—'}/100</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, interviewScore || 0)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Skill Coverage
            </span>
            <span className="font-semibold text-slate-200">{skillCoverageScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, skillCoverageScore)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/60 rounded-xl p-2.5 border border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Role Alignment
            </span>
            <span className="font-semibold text-slate-200">{roleAlignmentScore}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, roleAlignmentScore)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
