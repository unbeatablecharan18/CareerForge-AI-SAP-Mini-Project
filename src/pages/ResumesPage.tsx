/**
 * CareerForge AI - Resume Intelligence Workspace
 * Upload real PDF/Word/TXT resumes, inspect extracted skills (detected vs inferred),
 * work experience, projects, and manage multiple documents.
 */
import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Plus,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  Edit2,
  Save,
  X,
  File
} from 'lucide-react';
import { api } from '../api.ts';
import { Resume, CandidateProfile } from '../types.ts';

interface ResumesPageProps {
  onNavigate: (tab: string, extra?: any) => void;
}

export const ResumesPage: React.FC<ResumesPageProps> = ({ onNavigate }) => {
  const [resumes, setResumes] = useState<Array<Resume & { profile?: CandidateProfile }>>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pasteModalOpen, setPasteModalOpen] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editSummary, setEditSummary] = useState('');

  const loadResumes = async () => {
    try {
      setLoading(true);
      const res = await api.getResumes();
      setResumes(res.resumes);
      if (res.resumes.length > 0 && !selectedResumeId) {
        setSelectedResumeId(res.resumes[0].id);
      }
    } catch (err) {
      console.error('Failed to load resumes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const activeResume = resumes.find(r => r.id === selectedResumeId) || resumes[0];
  const activeProfile = activeResume?.profile;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 30 * 1024 * 1024) {
      setError('File too large. Maximum supported resume size is 30MB.');
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.uploadResume(formData);
      await loadResumes();
      setSelectedResumeId(res.resume.id);
    } catch (err) {
      setError((err as Error).message || 'Failed to upload and parse resume.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handlePastedUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;

    setUploading(true);
    setError(null);

    try {
      const res = await api.uploadResumeText({
        title: pastedTitle || 'Direct_Resume_Entry',
        rawText: pastedText,
      });
      setPasteModalOpen(false);
      setPastedText('');
      setPastedTitle('');
      await loadResumes();
      setSelectedResumeId(res.resume.id);
    } catch (err) {
      setError((err as Error).message || 'Failed to analyze resume text.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await api.deleteResume(id);
      await loadResumes();
      if (selectedResumeId === id) {
        setSelectedResumeId(null);
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to delete resume.');
    }
  };

  const handleSaveSummary = async () => {
    if (!activeResume || !activeProfile) return;
    try {
      await api.updateResumeProfile(activeResume.id, {
        summary: editSummary,
      });
      activeProfile.summary = editSummary;
      setIsEditing(false);
    } catch (err) {
      setError((err as Error).message || 'Failed to update summary.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Resume Intelligence Workspace
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Verified Evidence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real LLM extraction distinguishes DETECTED from INFERRED skills with verifiable citations.
          </p>
        </div>

        {/* Upload Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPasteModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-400" />
            <span>Paste Text</span>
          </button>

          <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5">
            <UploadCloud className="w-4 h-4" />
            <span>{uploading ? 'Analyzing with AI...' : 'Upload PDF / Word'}</span>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploading progress notification */}
      {uploading && (
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800 text-cyan-200 text-xs flex items-center gap-3 animate-pulse">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
          <div>
            <div className="font-semibold text-white">Reading and structuring your resume...</div>
            <div className="text-cyan-300/80 text-[11px]">
              Extracting candidate profile, engineering stack, work history, and verified evidence with Gemini 3.8 Flash.
            </div>
          </div>
        </div>
      )}

      {/* Resume Selector bar (if multiple resumes) */}
      {resumes.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {resumes.map(r => (
            <button
              key={r.id}
              onClick={() => {
                setSelectedResumeId(r.id);
                setIsEditing(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all shrink-0 ${
                activeResume?.id === r.id
                  ? 'bg-slate-900 border-indigo-500 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <File className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[200px]">{r.originalName}</span>
              {activeResume?.id === r.id && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Extracted Profile Display */}
      {activeResume && activeProfile ? (
        <div className="space-y-6">
          {/* Candidate Summary Header Card */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-white tracking-tight">{activeProfile.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Profile Extracted
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                {activeProfile.email && <span>Email: <strong className="text-slate-200">{activeProfile.email}</strong></span>}
                {activeProfile.location && <span>Location: <strong className="text-slate-200">{activeProfile.location}</strong></span>}
                <span>File: <strong className="text-slate-200">{activeResume.originalName}</strong></span>
                <span>Size: <strong className="text-slate-200">{Math.round(activeResume.fileSize / 1024)} KB</strong></span>
              </div>

              {/* Summary Text */}
              <div className="mt-3 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Executive Professional Summary</span>
                  {!isEditing ? (
                    <button
                      onClick={() => {
                        setEditSummary(activeProfile.summary || '');
                        setIsEditing(true);
                      }}
                      className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSaveSummary}
                        className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <Save className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="text-slate-400 hover:underline text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {activeProfile.summary || 'No summary detected in document.'}
                  </p>
                ) : (
                  <textarea
                    value={editSummary}
                    onChange={e => setEditSummary(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                )}
              </div>
            </div>

            {/* Actions on active resume */}
            <div className="flex flex-row md:flex-col gap-2 shrink-0">
              <button
                onClick={() => onNavigate('match', { resumeId: activeResume.id })}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Match Target Role
              </button>
              <button
                onClick={() => handleDeleteResume(activeResume.id)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </div>

          {/* Technical Skills: Detected vs Inferred Grid */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Extracted Skill Matrix</h3>
                <p className="text-xs text-slate-400">
                  Clearly distinguishing explicit detected skills from contextual inferred skills.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  {activeProfile.skills.filter(s => s.level === 'detected').length} Detected
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                  {activeProfile.skills.filter(s => s.level === 'inferred').length} Inferred
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-4">
              {activeProfile.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-xs text-slate-100">{skill.name}</span>
                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      skill.level === 'detected'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mb-1">{skill.category}</div>
                  {skill.evidence && (
                    <p className="text-[10px] text-slate-400 italic line-clamp-2 bg-slate-900 p-1.5 rounded">
                      "{skill.evidence}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Work Experience & Projects Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Work History */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
              <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-cyan-400" /> Professional Experience
              </h3>
              <div className="space-y-4">
                {activeProfile.experience && activeProfile.experience.length > 0 ? (
                  activeProfile.experience.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{exp.role}</span>
                        <span className="text-slate-400">{exp.startDate} - {exp.endDate}</span>
                      </div>
                      <div className="text-xs text-cyan-400 font-medium mb-2">{exp.company}</div>
                      <ul className="space-y-1 text-xs text-slate-300">
                        {exp.description.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-1.5">
                            <span className="text-slate-500">•</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                      {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3 pt-2 border-t border-slate-900">
                          {exp.skillsUsed.map((s, sIdx) => (
                            <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No structured experience detected.</p>
                )}
              </div>
            </div>

            {/* Projects & Education */}
            <div className="space-y-6">
              {/* Projects */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 mb-4">
                  <FolderGit2 className="w-5 h-5 text-indigo-400" /> Featured Projects
                </h3>
                <div className="space-y-3">
                  {activeProfile.projects && activeProfile.projects.length > 0 ? (
                    activeProfile.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white">{proj.name}</span>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
                            >
                              Code <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 mb-2">{proj.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {proj.technologies.map((t, tIdx) => (
                            <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-indigo-950/40 text-indigo-300 font-mono border border-indigo-900/30">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400">No project portfolio entries detected.</p>
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl">
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-emerald-400" /> Education & Credentials
                </h3>
                {activeProfile.education && activeProfile.education.length > 0 ? (
                  activeProfile.education.map((edu, idx) => (
                    <div key={idx} className="text-xs text-slate-300">
                      <div className="font-bold text-white">{edu.degree} in {edu.field}</div>
                      <div className="text-slate-400">{edu.institution} {edu.graduationYear ? `(${edu.graduationYear})` : ''}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No education entries extracted.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-200">No Resume Uploaded Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Upload your PDF resume or paste plain text to extract your engineering profile and prepare for target roles.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setPasteModalOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Paste Text
            </button>
            <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors">
              Upload PDF
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* PASTE RESUME TEXT MODAL */}
      {pasteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setPasteModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Paste Resume Content</h3>
            <p className="text-xs text-slate-400 mb-4">
              Paste the text from your resume. Gemini will parse contact details, experience, and skills.
            </p>

            <form onSubmit={handlePastedUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Resume Title</label>
                <input
                  type="text"
                  placeholder="e.g. Alex_FullStack_2026"
                  value={pastedTitle}
                  onChange={e => setPastedTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Raw Resume Text</label>
                <textarea
                  required
                  rows={12}
                  placeholder="Paste resume content here..."
                  value={pastedText}
                  onChange={e => setPastedText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPasteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !pastedText.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/30"
                >
                  {uploading ? 'Processing AI...' : 'Analyze Resume'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
