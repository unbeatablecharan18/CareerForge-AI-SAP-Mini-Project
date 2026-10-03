/**
 * CareerForge AI - Client Type Definitions
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  targetRoleTitle?: string;
  experienceYears?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CandidateSkill {
  name: string;
  category: 'Programming' | 'Frontend' | 'Backend' | 'Web' | 'Databases' | 'Cloud' | 'DevOps' | 'AI/ML' | 'Data Science' | 'Tools' | 'Security' | 'Soft Skills';
  level: 'detected' | 'inferred';
  evidence?: string;
  yearsExperience?: number;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  resumeId: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear?: string;
  }>;
  experience: Array<{
    company: string;
    role: string;
    startDate?: string;
    endDate?: string;
    description: string[];
    skillsUsed: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  skills: CandidateSkill[];
  certifications: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  rawText: string;
  profileId?: string;
  profile?: CandidateProfile;
  createdAt: string;
  updatedAt: string;
}

export interface JobProfile {
  id: string;
  userId: string;
  jobId: string;
  title: string;
  company: string;
  seniority: 'Intern' | 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff';
  location?: string;
  requiredSkills: Array<{ name: string; category: string; importance: 'high' | 'critical' }>;
  preferredSkills: Array<{ name: string; category: string; importance: 'medium' | 'nice-to-have' }>;
  responsibilities: string[];
  qualifications: string[];
  educationRequirements?: string;
  experienceRequirements?: string;
  domainKnowledge: string[];
  createdAt: string;
}

export interface JobDescription {
  id: string;
  userId: string;
  title: string;
  company: string;
  location?: string;
  rawText: string;
  profileId?: string;
  profile?: JobProfile;
  createdAt: string;
  updatedAt: string;
}

export interface SkillGapItem {
  skillName: string;
  category: string;
  status: 'STRONG' | 'PARTIAL' | 'NOT DEMONSTRATED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  whyMatters: string;
  evidence: string;
  jobRequirement: string;
  gapExplanation: string;
  learningAction: string;
  interviewQuestions: string[];
}

export interface CompatibilityMatch {
  id: string;
  userId: string;
  resumeId: string;
  jobId: string;
  overallScore: number;
  technicalScore: number;
  projectScore: number;
  experienceScore: number;
  educationScore: number;
  semanticScore: number;
  preferredSkillCoverage: number;
  skillGaps: SkillGapItem[];
  strengths: string[];
  weaknesses: string[];
  atsAnalysis?: {
    keywordDensityScore: number;
    readabilityScore: number;
    completenessScore: number;
    feedback: string[];
  };
  createdAt: string;
}

export interface InterviewQuestionItem {
  id: string;
  questionNumber: number;
  category: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionText: string;
  contextOrCode?: string;
  targetedSkill?: string;
  isGapTargeted: boolean;
  expectedKeyPoints: string[];
  starterCode?: string;
}

export interface AnswerEvaluationItem {
  questionId: string;
  answerText: string;
  codeAnswer?: string;
  technicalAccuracy: number;
  completeness: number;
  problemSolving: number;
  roleRelevance: number;
  communication: number;
  weightedScore: number;
  strengths: string[];
  missingConcepts: string[];
  technicalCorrection: string;
  improvementAdvice: string;
  betterAnswerStructure: string;
  followUpQuestion?: string;
  evaluatedAt: string;
}

export interface InterviewReport {
  id: string;
  interviewId: string;
  userId: string;
  overallScore: number;
  technicalAccuracyScore: number;
  problemSolvingScore: number;
  completenessScore: number;
  roleRelevanceScore: number;
  communicationScore: number;
  strongAreas: string[];
  weakAreas: string[];
  criticalGapsDiscovered: string[];
  nextSteps: string[];
  comparisonWithPrevious?: {
    previousScore: number;
    scoreDelta: number;
    improvedSkills: string[];
    stagnantSkills: string[];
  };
  createdAt: string;
}

export interface InterviewSession {
  id: string;
  userId: string;
  resumeId: string;
  jobId: string;
  matchId: string;
  mode: 'Technical Interview' | 'Role-Specific Interview' | 'Skill-Gap Interview' | 'Project Interview' | 'Full Mock Interview';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalQuestions: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  questions: InterviewQuestionItem[];
  answers: Record<string, string>;
  evaluations: Record<string, AnswerEvaluationItem>;
  reportId?: string;
  jobTitle?: string;
  company?: string;
  report?: InterviewReport;
  createdAt: string;
  completedAt?: string;
}

export interface LearningRoadmap {
  id: string;
  userId: string;
  jobId: string;
  matchId: string;
  interviewId?: string;
  title: string;
  estimatedWeeks: number;
  priorities: Array<{
    skill: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    whyMatters: string;
    currentStatus: string;
    targetMilestone: string;
    learningResources: Array<{ title: string; type: string; url?: string }>;
    practiceTask: string;
    interviewPracticeQuestion: string;
  }>;
  milestones: Array<{
    week: number;
    title: string;
    skillsCovered: string[];
    deliverable: string;
  }>;
  createdAt: string;
}

export interface ProgressSnapshot {
  id: string;
  userId: string;
  jobId?: string;
  interviewId: string;
  overallScore: number;
  technicalScore: number;
  compatibilityScore: number;
  strongSkillsCount: number;
  gapSkillsCount: number;
  topStrength: string;
  topGap: string;
  timestamp: string;
}
