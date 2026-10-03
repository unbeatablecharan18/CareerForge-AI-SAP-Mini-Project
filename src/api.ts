/**
 * CareerForge AI - Typed API Client
 */
import {
  User,
  Resume,
  CandidateProfile,
  JobDescription,
  JobProfile,
  CompatibilityMatch,
  InterviewSession,
  InterviewReport,
  LearningRoadmap,
  ProgressSnapshot,
  AnswerEvaluationItem,
  InterviewQuestionItem,
} from './types.ts';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = localStorage.getItem('careerforge_token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(payload: { name: string; email: string; password: string; targetRoleTitle?: string; experienceYears?: number }) {
    const res = await request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.token) localStorage.setItem('careerforge_token', res.token);
    return res;
  },

  async login(payload: { email: string; password: string }) {
    const res = await request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res.token) localStorage.setItem('careerforge_token', res.token);
    return res;
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('careerforge_token');
    }
  },

  async getMe() {
    return request<{ user: User }>('/auth/me');
  },

  async updateProfile(updates: Partial<User>) {
    return request<{ user: User }>('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  // Resumes
  async uploadResume(formData: FormData) {
    return request<{ resume: Resume; profile: CandidateProfile }>('/resumes/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async uploadResumeText(payload: { title?: string; rawText: string }) {
    return request<{ resume: Resume; profile: CandidateProfile }>('/resumes/upload', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getResumes() {
    return request<{ resumes: Array<Resume & { profile?: CandidateProfile }> }>('/resumes');
  },

  async getResume(id: string) {
    return request<{ resume: Resume; profile?: CandidateProfile }>(`/resumes/${id}`);
  },

  async updateResumeProfile(id: string, profile: Partial<CandidateProfile>) {
    return request<{ profile: CandidateProfile }>(`/resumes/${id}/profile`, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  async deleteResume(id: string) {
    return request<{ success: boolean }>(`/resumes/${id}`, { method: 'DELETE' });
  },

  // Jobs
  async createJob(payload: { title?: string; company?: string; location?: string; rawText: string }) {
    return request<{ job: JobDescription; jobProfile: JobProfile }>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getJobs() {
    return request<{ jobs: Array<JobDescription & { profile?: JobProfile }> }>('/jobs');
  },

  async getJob(id: string) {
    return request<{ job: JobDescription; profile?: JobProfile }>(`/jobs/${id}`);
  },

  async deleteJob(id: string) {
    return request<{ success: boolean }>(`/jobs/${id}`, { method: 'DELETE' });
  },

  // Compatibility & Matches
  async runMatch(payload: { resumeId: string; jobId: string }) {
    return request<{ match: CompatibilityMatch }>('/analysis/match', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getMatch(id: string) {
    return request<{ match: CompatibilityMatch; resume: Resume; job: JobDescription }>(`/analysis/${id}`);
  },

  // Interviews
  async startInterview(payload: {
    resumeId: string;
    jobId: string;
    matchId?: string;
    mode?: string;
    difficulty?: string;
    totalQuestions?: number;
  }) {
    return request<{ interview: InterviewSession }>('/interviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getInterviews() {
    return request<{ interviews: InterviewSession[] }>('/interviews');
  },

  async getInterview(id: string) {
    return request<{ interview: InterviewSession; job?: JobDescription; report?: InterviewReport }>(`/interviews/${id}`);
  },

  async submitAnswer(id: string, payload: { questionId: string; answerText: string; codeAnswer?: string }) {
    return request<{
      evaluation: AnswerEvaluationItem;
      isFinished: boolean;
      nextQuestion: InterviewQuestionItem | null;
      interview: InterviewSession;
    }>(`/interviews/${id}/answers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async skipQuestion(id: string, questionId: string) {
    return request<{
      isFinished: boolean;
      nextQuestion: InterviewQuestionItem | null;
      interview: InterviewSession;
    }>(`/interviews/${id}/skip`, {
      method: 'POST',
      body: JSON.stringify({ questionId }),
    });
  },

  async getInterviewReport(id: string) {
    return request<{ report: InterviewReport; interview: InterviewSession; job: JobDescription }>(`/interviews/${id}/report`);
  },

  async getQuestionSpeechAudio(interviewId: string, text: string) {
    return request<{ audioBase64: string; format: string }>(`/interviews/${interviewId}/tts?text=${encodeURIComponent(text)}`);
  },

  // Roadmap & Progress
  async getRoadmap(jobId: string) {
    return request<{ roadmap: LearningRoadmap | null }>(`/roadmaps/${jobId}`);
  },

  async generateRoadmap(payload: { jobId: string; resumeId?: string }) {
    return request<{ roadmap: LearningRoadmap }>('/roadmaps/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getProgress() {
    return request<{
      snapshots: ProgressSnapshot[];
      careerReadiness: number;
      totalInterviews: number;
      completedInterviewsCount: number;
      latestScore: number | null;
      latestCompatibility: number | null;
      latestMatch?: CompatibilityMatch;
    }>('/progress');
  },

  // Sandbox Code Runner
  async runCode(payload: { code: string; language?: string }) {
    return request<{ success: boolean; output: string; error?: string }>('/code/run', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin
  async getAdminStats() {
    return request<{ stats: any }>('/admin/stats');
  },

  async getAdminUsers() {
    return request<{ users: User[] }>('/admin/users');
  },

  async getAdminLogs() {
    return request<{ logs: any[] }>('/admin/logs');
  },

  // Security Audit Check
  async runSecurityAudit() {
    return request<{ suite: string; overall: string; timestamp: string; results: any[] }>('/test-security');
  },
};
