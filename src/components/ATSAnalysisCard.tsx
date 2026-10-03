/**
 * CareerForge AI - ATS-Oriented Analysis Component
 * Inspects resume readability, keyword density, section completeness, and job alignment.
 */
import React from 'react';
import { FileText, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface ATSAnalysisProps {
  atsData?: {
    keywordDensityScore: number;
    readabilityScore: number;
    completenessScore: number;
    feedback: string[];
  };
  className?: string;
}

export const ATSAnalysisCard: React.FC<ATSAnalysisProps> = ({ atsData, className = '' }) => {
  if (!atsData) return null;

  return (
    <div className={`p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl ${className}`}>
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">ATS-Oriented Analysis</h3>
            <p className="text-xs text-slate-400">Readability and keyword indexing against Applicant Tracking Systems</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Overall ATS Health</span>
          <div className="text-xl font-bold text-cyan-400">
            {Math.round((atsData.keywordDensityScore + atsData.readabilityScore + atsData.completenessScore) / 3)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-xs text-slate-400">Keyword Density</div>
          <div className="text-lg font-bold text-slate-100 mt-0.5">{atsData.keywordDensityScore}%</div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${atsData.keywordDensityScore}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-xs text-slate-400">Format & Readability</div>
          <div className="text-lg font-bold text-slate-100 mt-0.5">{atsData.readabilityScore}%</div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${atsData.readabilityScore}%` }} />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="text-xs text-slate-400">Section Completeness</div>
          <div className="text-lg font-bold text-slate-100 mt-0.5">{atsData.completenessScore}%</div>
          <div className="h-1.5 w-full bg-slate-900 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${atsData.completenessScore}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 text-xs">
        <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" /> Actionable ATS Feedback:
        </div>
        <ul className="space-y-1.5 text-slate-400">
          {atsData.feedback.map((f, i) => (
            <li key={i} className="flex items-start gap-1.5">
              <span className="text-cyan-400">•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 text-[11px] text-slate-500 italic">
        * Note: CareerForge AI provides ATS simulation guidance to maximize clarity without fabricating credentials.
      </div>
    </div>
  );
};
