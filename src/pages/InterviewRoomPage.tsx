/**
 * CareerForge AI - Immersive AI Interview Room
 * Adaptive technical mock interview environment with live speech synthesis (TTS),
 * microphone speech-to-text, coding sandbox editor, and instant coaching feedback.
 */
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Code,
  Send,
  SkipForward,
  HelpCircle,
  Clock,
  Award,
  Layers,
  Terminal,
  RotateCcw
} from 'lucide-react';
import { api } from '../api.ts';
import { InterviewSession, InterviewQuestionItem, AnswerEvaluationItem } from '../types.ts';
import { SandboxCodeEditor } from '../components/SandboxCodeEditor.tsx';

interface InterviewRoomPageProps {
  onNavigate: (tab: string, extra?: any) => void;
  initialInterviewId?: string;
  resumeId?: string;
  jobId?: string;
  matchId?: string;
  mode?: string;
}

export const InterviewRoomPage: React.FC<InterviewRoomPageProps> = ({
  onNavigate,
  initialInterviewId,
  resumeId,
  jobId,
  matchId,
  mode = 'Technical Interview',
}) => {
  const [interview, setInterview] = useState<InterviewSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answerText, setAnswerText] = useState('');
  const [codeAnswer, setCodeAnswer] = useState('');
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [lastEvaluation, setLastEvaluation] = useState<AnswerEvaluationItem | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Setup interview session
  useEffect(() => {
    async function initInterview() {
      try {
        setLoading(true);
        if (initialInterviewId) {
          const res = await api.getInterview(initialInterviewId);
          setInterview(res.interview);
        } else {
          // If params given or auto-fetch existing
          let targetResumeId = resumeId;
          let targetJobId = jobId;

          if (!targetResumeId || !targetJobId) {
            const [resumesRes, jobsRes] = await Promise.all([api.getResumes(), api.getJobs()]);
            targetResumeId = resumesRes.resumes[0]?.id;
            targetJobId = jobsRes.jobs[0]?.id;
          }

          if (targetResumeId && targetJobId) {
            const res = await api.startInterview({
              resumeId: targetResumeId,
              jobId: targetJobId,
              matchId,
              mode: mode as any,
              difficulty: 'Intermediate',
              totalQuestions: 5,
            });
            setInterview(res.interview);
          }
        }
      } catch (err) {
        console.error('Failed to init interview:', err);
      } finally {
        setLoading(false);
      }
    }
    initInterview();
  }, [initialInterviewId, resumeId, jobId, matchId, mode]);

  // Speech-to-Text Setup using browser Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setAnswerText(prev => `${prev} ${transcript}`.trim());
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const currentQIndex = interview ? interview.currentQuestionIndex : 0;
  const currentQuestion: InterviewQuestionItem | undefined = interview?.questions?.[currentQIndex];

  // Play question audio automatically when new question arrives if voice enabled
  useEffect(() => {
    if (currentQuestion && voiceEnabled && interview?.status === 'in_progress') {
      playQuestionAudio(currentQuestion.questionText);
    }
  }, [currentQuestion?.id, voiceEnabled]);

  const playQuestionAudio = async (text: string) => {
    if (!interview) return;
    try {
      setAudioPlaying(true);
      const res = await api.getQuestionSpeechAudio(interview.id, text);
      if (res.audioBase64) {
        const audioSrc = `data:${res.format};base64,${res.audioBase64}`;
        setAudioUrl(audioSrc);
        if (audioRef.current) {
          audioRef.current.src = audioSrc;
          audioRef.current.play().catch(e => console.warn('Audio auto-play prevented:', e));
        }
      }
    } catch (err) {
      console.warn('TTS playback issue:', err);
    } finally {
      setAudioPlaying(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser. Please type your response.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!interview || !currentQuestion) return;
    if (!answerText.trim() && !codeAnswer.trim()) {
      alert('Please type or speak your answer before submitting.');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setSubmitting(true);

    try {
      const res = await api.submitAnswer(interview.id, {
        questionId: currentQuestion.id,
        answerText: answerText.trim(),
        codeAnswer: codeAnswer.trim() || undefined,
      });

      setLastEvaluation(res.evaluation);
      setShowFeedbackModal(true);
      setInterview(res.interview);

      if (res.isFinished) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      alert((err as Error).message || 'Failed to submit answer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkipQuestion = async () => {
    if (!interview || !currentQuestion) return;
    if (!window.confirm('Are you sure you want to skip this question?')) return;

    setSubmitting(true);
    try {
      const res = await api.skipQuestion(interview.id, currentQuestion.id);
      setInterview(res.interview);
      setAnswerText('');
      setCodeAnswer('');
      if (res.isFinished) {
        onNavigate('report', { interviewId: interview.id });
      }
    } catch (err) {
      alert((err as Error).message || 'Failed to skip question.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setShowFeedbackModal(false);
    setAnswerText('');
    setCodeAnswer('');
    setShowCodeEditor(false);

    if (interview?.status === 'completed') {
      onNavigate('report', { interviewId: interview.id });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 text-center">
        <Sparkles className="w-10 h-10 text-cyan-400 animate-spin" />
        <h3 className="text-lg font-bold text-white">Preparing Your Personalized Interview Room...</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Generating role-specific technical questions tailored to your resume gaps with Gemini 3.8 Flash.
        </p>
      </div>
    );
  }

  if (!interview || !currentQuestion) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-500 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Active Interview Session</h3>
        <p className="text-xs text-slate-400">
          Start an adaptive mock interview from your target role or compatibility workspace.
        </p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
        >
          Return to Command Center
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentQIndex) / interview.totalQuestions) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in duration-300">
      {/* Hidden audio element for TTS */}
      <audio ref={audioRef} onEnded={() => setAudioPlaying(false)} className="hidden" />

      {/* Top Bar: Interview Progress & Mode Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>{interview.mode}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-semibold border border-slate-700">
                {interview.difficulty}
              </span>
              {currentQuestion.isGapTargeted && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                  Targeting Gap: {currentQuestion.targetedSkill}
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Question {currentQIndex + 1} of {interview.totalQuestions}
            </div>
          </div>
        </div>

        {/* Progress Bar & Voice Toggle */}
        <div className="flex items-center gap-4">
          <div className="w-32 hidden sm:block">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              voiceEnabled
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                : 'bg-slate-800/40 border-slate-800 text-slate-500'
            }`}
            title={voiceEnabled ? 'Disable TTS Voice' : 'Enable TTS Voice'}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px]">AI Voice</span>
          </button>
        </div>
      </div>

      {/* QUESTION POD: Immersive AI Interviewer Display */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-28 bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
              Topic: {currentQuestion.topic}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {currentQuestion.questionText}
            </h2>
          </div>

          {/* Re-play audio button */}
          <button
            onClick={() => playQuestionAudio(currentQuestion.questionText)}
            className="p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-700/60 transition-colors shrink-0"
            title="Read Question Aloud"
          >
            <Play className={`w-4 h-4 ${audioPlaying ? 'animate-pulse text-cyan-400' : ''}`} />
          </button>
        </div>

        {/* Question context or starter code if present */}
        {currentQuestion.contextOrCode && (
          <div className="mt-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300">
            {currentQuestion.contextOrCode}
          </div>
        )}
      </div>

      {/* CANDIDATE ANSWER WORKSPACE */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Your Technical Response
            </span>
            {isListening && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Listening to microphone...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Code Editor */}
            <button
              onClick={() => setShowCodeEditor(!showCodeEditor)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                showCodeEditor
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>{showCodeEditor ? 'Hide Code' : 'Attach Code / Sandbox'}</span>
            </button>

            {/* Speech to text microphone button */}
            <button
              onClick={toggleListening}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isListening
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Speak Answer via Microphone"
            >
              {isListening ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isListening ? 'Stop Mic' : 'Voice Input'}</span>
            </button>
          </div>
        </div>

        {/* Text Answer Area */}
        <textarea
          value={answerText}
          onChange={e => setAnswerText(e.target.value)}
          rows={6}
          placeholder="Speak or type your architectural analysis, implementation trade-offs, and rationale here..."
          className="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
        />

        {/* Sandbox Code Editor Drawer */}
        {showCodeEditor && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <SandboxCodeEditor
              initialCode={currentQuestion.starterCode || '// Write algorithm or technical implementation here\n'}
              onCodeChange={setCodeAnswer}
            />
          </div>
        )}

        {/* Bottom Submission Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <button
            onClick={handleSkipQuestion}
            disabled={submitting}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 font-medium transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Skip this Question</span>
          </button>

          <button
            onClick={handleSubmitAnswer}
            disabled={submitting || (!answerText.trim() && !codeAnswer.trim())}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating with AI...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Answer for AI Coaching</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI COACHING FEEDBACK MODAL (Post-Answer Evaluation) */}
      {showFeedbackModal && lastEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Modal Header & Overall Score */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  AI Coaching Feedback
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Answer Evaluation</h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 font-semibold">Weighted Score</span>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                  {lastEvaluation.weightedScore}/100
                </div>
              </div>
            </div>

            {/* 5-Category Sub-scores Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Tech Accuracy</span>
                <span className="text-sm font-bold text-slate-100">{lastEvaluation.technicalAccuracy}/10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Problem Solving</span>
                <span className="text-sm font-bold text-slate-100">{lastEvaluation.problemSolving}/10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Completeness</span>
                <span className="text-sm font-bold text-slate-100">{lastEvaluation.completeness}/10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Role Relevance</span>
                <span className="text-sm font-bold text-slate-100">{lastEvaluation.roleRelevance}/10</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-400 block">Communication</span>
                <span className="text-sm font-bold text-slate-100">{lastEvaluation.communication}/10</span>
              </div>
            </div>

            {/* Strengths & Missing Concepts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
                <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> What You Nailed
                </h5>
                <ul className="space-y-1 text-xs text-slate-300">
                  {lastEvaluation.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/30">
                <h5 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Missing Concepts
                </h5>
                <ul className="space-y-1 text-xs text-slate-300">
                  {lastEvaluation.missingConcepts.map((m, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical Correction */}
            {lastEvaluation.technicalCorrection && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-semibold text-cyan-400 block mb-1">Technical Precision Note:</span>
                <p className="text-slate-300">{lastEvaluation.technicalCorrection}</p>
              </div>
            )}

            {/* Better Answer Structure Recommendation */}
            {lastEvaluation.betterAnswerStructure && (
              <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/40 text-xs text-indigo-200">
                <span className="font-semibold text-indigo-300 block mb-1">
                  How a Staff Engineer Structures This Answer:
                </span>
                <p className="text-indigo-200/90 leading-relaxed">{lastEvaluation.betterAnswerStructure}</p>
              </div>
            )}

            {/* Next Action Button */}
            <div className="flex items-center justify-end pt-4 border-t border-slate-800">
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <span>
                  {interview?.status === 'completed'
                    ? 'View Final Coaching Report'
                    : 'Proceed to Next Adaptive Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
