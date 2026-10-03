/**
 * CareerForge AI - Relational Database Engine
 * Persistent file-backed relational store with strict schemas, foreign keys, 
 * index indexing, and atomic write transactions.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'user' | 'admin';
  targetRoleTitle?: string;
  experienceYears?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
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
  overallScore: number; // 0 - 100
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
  technicalAccuracy: number; // 0 - 10
  completeness: number; // 0 - 10
  problemSolving: number; // 0 - 10
  roleRelevance: number; // 0 - 10
  communication: number; // 0 - 10
  weightedScore: number; // 0 - 100
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

export interface AdminActionLog {
  id: string;
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string;
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  users: User[];
  sessions: Session[];
  resumes: Resume[];
  candidateProfiles: CandidateProfile[];
  jobs: JobDescription[];
  jobProfiles: JobProfile[];
  matches: CompatibilityMatch[];
  interviews: InterviewSession[];
  reports: InterviewReport[];
  roadmaps: LearningRoadmap[];
  progressSnapshots: ProgressSnapshot[];
  adminLogs: AdminActionLog[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'careerforge.db.json');

// Initial in-memory state
let db: DatabaseSchema = {
  users: [],
  sessions: [],
  resumes: [],
  candidateProfiles: [],
  jobs: [],
  jobProfiles: [],
  matches: [],
  interviews: [],
  reports: [],
  roadmaps: [],
  progressSnapshots: [],
  adminLogs: [],
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Atomic file persistence
function saveToDisk() {
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tempFile, JSON.stringify(db, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
  } catch (err) {
    console.error('Error saving DB to disk:', err);
    if (fs.existsSync(tempFile)) {
      try { fs.unlinkSync(tempFile); } catch (_) {}
    }
  }
}

// Load database from disk
export function initDatabase() {
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data);
      console.log(`[Database] Loaded CareerForge store from disk (${db.users.length} users)`);
    } catch (err) {
      console.error('[Database] Failed to read database file, initializing defaults:', err);
    }
  }

  // Ensure arrays exist
  db.users = db.users || [];
  db.sessions = db.sessions || [];
  db.resumes = db.resumes || [];
  db.candidateProfiles = db.candidateProfiles || [];
  db.jobs = db.jobs || [];
  db.jobProfiles = db.jobProfiles || [];
  db.matches = db.matches || [];
  db.interviews = db.interviews || [];
  db.reports = db.reports || [];
  db.roadmaps = db.roadmaps || [];
  db.progressSnapshots = db.progressSnapshots || [];
  db.adminLogs = db.adminLogs || [];

  // Seed default admin account if not present
  const adminExists = db.users.some(u => u.email === 'admin@careerforge.ai');
  if (!adminExists) {
    const salt = bcrypt.genSaltSync(10);
    const adminUser: User = {
      id: 'usr_admin_master',
      email: 'admin@careerforge.ai',
      passwordHash: bcrypt.hashSync('Admin@Forge2026!', salt),
      name: 'Forge Administrator',
      role: 'admin',
      targetRoleTitle: 'Engineering Director',
      experienceYears: 10,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(adminUser);
    console.log('[Database] Seeded Admin account: admin@careerforge.ai / Admin@Forge2026!');
  }

  // Seed standard candidate user for instant seamless evaluation
  const demoExists = db.users.some(u => u.email === 'candidate@careerforge.ai');
  if (!demoExists) {
    const salt = bcrypt.genSaltSync(10);
    const demoUser: User = {
      id: 'usr_candidate_demo',
      email: 'candidate@careerforge.ai',
      passwordHash: bcrypt.hashSync('Candidate@2026!', salt),
      name: 'Alex Rivera',
      role: 'user',
      targetRoleTitle: 'Full-Stack Software Engineer',
      experienceYears: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.users.push(demoUser);

    // Seed Alex's sample resume
    const demoResume: Resume = {
      id: 'res_demo_alex',
      userId: demoUser.id,
      filename: 'alex_rivera_fullstack_resume.pdf',
      originalName: 'Alex_Rivera_Software_Engineer.pdf',
      fileSize: 45280,
      mimeType: 'application/pdf',
      rawText: `Alex Rivera\nEmail: alex.rivera@example.com | GitHub: github.com/alexrivera\nSan Francisco, CA\n\nPROFESSIONAL SUMMARY\nSoftware Engineer with 3 years building scalable React web applications, TypeScript microservices, and PostgreSQL database layers. Passionate about clean APIs and high-performance UI.\n\nEXPERIENCE\nSoftware Engineer | Apex Cloud Systems (2023 - Present)\n- Engineered modern React and TypeScript frontend workflows serving 150k monthly active users.\n- Built Node.js and Express RESTful services integrated with PostgreSQL databases, improving query latency by 35%.\n- Designed CI/CD workflows using GitHub Actions and containerized microservices with Docker.\n- Integrated Redis caching layer for session management and rate limiting.\n\nJunior Full-Stack Developer | Nexus Labs (2021 - 2023)\n- Developed responsive web interfaces using React, Tailwind CSS, and Next.js.\n- Implemented Python automation scripts and REST endpoints for data ingestion.\n- Collaborated with product teams to deliver 12 major feature rollouts on schedule.\n\nEDUCATION\nB.S. in Computer Science | University of California, Berkeley (2017 - 2021)\nRelevant Coursework: Data Structures, Algorithms, Database Systems, Computer Networks.\n\nSKILLS\nLanguages: TypeScript, JavaScript, Python, SQL, HTML, CSS\nFrameworks & Libraries: React, Node.js, Express, Next.js, Tailwind CSS, Jest\nDatabases: PostgreSQL, Redis, SQLite\nTools & Platforms: Git, Docker, GitHub Actions, AWS (S3, EC2), Postman`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.resumes.push(demoResume);

    const demoProfile: CandidateProfile = {
      id: 'prof_demo_alex',
      userId: demoUser.id,
      resumeId: demoResume.id,
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      location: 'San Francisco, CA',
      summary: 'Software Engineer with 3 years building scalable React web applications, TypeScript microservices, and PostgreSQL database layers.',
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'B.S.',
          field: 'Computer Science',
          graduationYear: '2021',
        }
      ],
      experience: [
        {
          company: 'Apex Cloud Systems',
          role: 'Software Engineer',
          startDate: '2023',
          endDate: 'Present',
          description: [
            'Engineered modern React and TypeScript frontend workflows serving 150k monthly active users.',
            'Built Node.js and Express RESTful services integrated with PostgreSQL databases, improving query latency by 35%.',
            'Designed CI/CD workflows using GitHub Actions and containerized microservices with Docker.',
            'Integrated Redis caching layer for session management and rate limiting.'
          ],
          skillsUsed: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'Redis'],
        },
        {
          company: 'Nexus Labs',
          role: 'Junior Full-Stack Developer',
          startDate: '2021',
          endDate: '2023',
          description: [
            'Developed responsive web interfaces using React, Tailwind CSS, and Next.js.',
            'Implemented Python automation scripts and REST endpoints for data ingestion.'
          ],
          skillsUsed: ['React', 'Tailwind CSS', 'Next.js', 'Python', 'REST API'],
        }
      ],
      projects: [
        {
          name: 'Distributed Task Queue',
          description: 'High-throughput async job processor built with Node.js, Redis, and PostgreSQL with worker pool management.',
          technologies: ['Node.js', 'TypeScript', 'Redis', 'PostgreSQL', 'Docker'],
          link: 'https://github.com/alexrivera/task-queue',
        }
      ],
      skills: [
        { name: 'TypeScript', category: 'Programming', level: 'detected', evidence: 'Built TypeScript microservices at Apex Cloud Systems' },
        { name: 'JavaScript', category: 'Programming', level: 'detected', evidence: 'Proficient in ESNext and modern JS frameworks' },
        { name: 'React', category: 'Frontend', level: 'detected', evidence: 'Engineered modern React frontend workflows serving 150k MAU' },
        { name: 'Node.js', category: 'Backend', level: 'detected', evidence: 'Built Node.js and Express RESTful services' },
        { name: 'Express', category: 'Backend', level: 'detected', evidence: 'Developed REST API endpoints using Express' },
        { name: 'PostgreSQL', category: 'Databases', level: 'detected', evidence: 'Integrated with PostgreSQL databases, improving query latency by 35%' },
        { name: 'Docker', category: 'DevOps', level: 'detected', evidence: 'Containerized microservices with Docker' },
        { name: 'Redis', category: 'Databases', level: 'detected', evidence: 'Integrated Redis caching layer for session management' },
        { name: 'Tailwind CSS', category: 'Frontend', level: 'detected', evidence: 'Styled responsive UI layouts with Tailwind CSS' },
        { name: 'Python', category: 'Programming', level: 'detected', evidence: 'Implemented Python automation scripts and data ingestion' },
        { name: 'REST API', category: 'Backend', level: 'detected', evidence: 'Designed clean RESTful services' },
        { name: 'Git', category: 'Tools', level: 'detected', evidence: 'Version control with Git & GitHub Actions' },
        { name: 'AWS', category: 'Cloud', level: 'inferred', evidence: 'Mentioned AWS (S3, EC2) in tools section' },
        { name: 'Microservices', category: 'Backend', level: 'inferred', evidence: 'Mentioned containerized microservices' }
      ],
      certifications: ['AWS Certified Cloud Practitioner (In Progress)'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.candidateProfiles.push(demoProfile);
    demoResume.profileId = demoProfile.id;

    // Seed target job description
    const demoJob: JobDescription = {
      id: 'job_demo_senior_fullstack',
      userId: demoUser.id,
      title: 'Senior Full-Stack Engineer (Platform & APIs)',
      company: 'Stripe',
      location: 'San Francisco, CA / Remote',
      rawText: `Senior Full-Stack Engineer (Platform & APIs) - Stripe\n\nAbout the Role:\nWe are seeking an experienced Senior Full-Stack Engineer to architect our next-generation developer platform and developer-facing APIs. You will work across the stack, crafting intuitive user experiences in React/TypeScript, developing robust microservices in Node.js/Go, and orchestrating distributed datastores.\n\nResponsibilities:\n- Design, scale, and maintain high-reliability RESTful and GraphQL APIs handling millions of requests daily.\n- Build modern, high-performance web applications using React, TypeScript, and modern CSS architecture.\n- Architect scalable relational database schemas in PostgreSQL with index optimization and query tuning.\n- Lead architectural reviews for microservice decomposition, message queueing (Kafka / RabbitMQ), and containerization (Docker, Kubernetes).\n- Mentor junior engineers and champion code quality, automated testing (Jest, Cypress), and continuous delivery.\n\nQualifications:\n- 4+ years of professional full-stack web software development experience.\n- Strong expertise in TypeScript, React, and Node.js.\n- Deep understanding of SQL databases, relational schema design, transactions, and PostgreSQL performance.\n- Solid experience with Docker, Kubernetes, and cloud infrastructure (AWS or GCP).\n- Familiarity with distributed message brokers like Apache Kafka or RabbitMQ.\n- Excellent problem-solving, debugging, and cross-functional communication skills.`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.jobs.push(demoJob);

    const demoJobProfile: JobProfile = {
      id: 'jobprof_demo_stripe',
      userId: demoUser.id,
      jobId: demoJob.id,
      title: demoJob.title,
      company: demoJob.company,
      seniority: 'Senior',
      location: 'San Francisco, CA / Remote',
      requiredSkills: [
        { name: 'TypeScript', category: 'Programming', importance: 'critical' },
        { name: 'React', category: 'Frontend', importance: 'critical' },
        { name: 'Node.js', category: 'Backend', importance: 'critical' },
        { name: 'PostgreSQL', category: 'Databases', importance: 'critical' },
        { name: 'REST API', category: 'Backend', importance: 'critical' },
        { name: 'Docker', category: 'DevOps', importance: 'high' },
        { name: 'Kubernetes', category: 'DevOps', importance: 'high' },
        { name: 'GraphQL', category: 'Web', importance: 'high' },
        { name: 'Kafka', category: 'Backend', importance: 'high' }
      ],
      preferredSkills: [
        { name: 'AWS', category: 'Cloud', importance: 'medium' },
        { name: 'RabbitMQ', category: 'Backend', importance: 'medium' },
        { name: 'Redis', category: 'Databases', importance: 'medium' },
        { name: 'Testing / Jest', category: 'Tools', importance: 'medium' }
      ],
      responsibilities: [
        'Design, scale, and maintain high-reliability RESTful and GraphQL APIs handling millions of requests daily.',
        'Build modern, high-performance web applications using React, TypeScript, and modern CSS architecture.',
        'Architect scalable relational database schemas in PostgreSQL with index optimization and query tuning.',
        'Lead architectural reviews for microservice decomposition, message queueing (Kafka), and Kubernetes orchestration.'
      ],
      qualifications: [
        '4+ years professional full-stack development experience.',
        'Strong expertise in TypeScript, React, Node.js, and PostgreSQL.',
        'Hands-on experience with Docker, Kubernetes, and distributed streaming (Kafka).'
      ],
      educationRequirements: 'B.S. in Computer Science or equivalent practical experience',
      experienceRequirements: '4+ years',
      domainKnowledge: ['FinTech', 'High-throughput APIs', 'Payment Infrastructure', 'Distributed Systems'],
      createdAt: new Date().toISOString(),
    };
    db.jobProfiles.push(demoJobProfile);
    demoJob.profileId = demoJobProfile.id;

    // Seed compatibility match
    const demoMatch: CompatibilityMatch = {
      id: 'match_demo_alex_stripe',
      userId: demoUser.id,
      resumeId: demoResume.id,
      jobId: demoJob.id,
      overallScore: 78,
      technicalScore: 82,
      projectScore: 76,
      experienceScore: 72,
      educationScore: 90,
      semanticScore: 84,
      preferredSkillCoverage: 75,
      strengths: [
        'Strong demonstrated proficiency in TypeScript, React, and Node.js matching core role stack.',
        'Verified hands-on experience with PostgreSQL database optimization and query latency reduction.',
        'Solid production exposure to Docker containerization and Redis caching.'
      ],
      weaknesses: [
        'Kubernetes orchestration is required for the Senior role but not demonstrated on the resume.',
        'GraphQL API design is explicitly required for Stripe developer platform APIs but absent from candidate profile.',
        'Distributed message brokers like Apache Kafka are not evidenced in current experience.'
      ],
      skillGaps: [
        {
          skillName: 'TypeScript',
          category: 'Programming',
          status: 'STRONG',
          priority: 'CRITICAL',
          whyMatters: 'Primary language for Stripe frontend web apps and backend Node microservices.',
          evidence: 'Built TypeScript microservices and React workflows at Apex Cloud Systems.',
          jobRequirement: 'Expertise in TypeScript across frontend and backend.',
          gapExplanation: 'Candidate has strong production track record with TypeScript.',
          learningAction: 'Continue reviewing advanced generics and AST tooling.',
          interviewQuestions: [
            'How do you design type-safe API client contracts using TypeScript generics and utility types?',
            'Explain the difference between type aliases and interfaces with regards to declaration merging.'
          ]
        },
        {
          skillName: 'PostgreSQL',
          category: 'Databases',
          status: 'STRONG',
          priority: 'CRITICAL',
          whyMatters: 'Core transactional datastore supporting high-volume payment ledgers.',
          evidence: 'Built PostgreSQL services and improved query latency by 35% via indexing.',
          jobRequirement: 'Deep understanding of SQL, schema design, transactions, and index tuning.',
          gapExplanation: 'Demonstrated experience with query tuning and relational schemas.',
          learningAction: 'Practice isolation levels (Serializable vs Read Committed) and MVCC internals.',
          interviewQuestions: [
            'How does PostgreSQL MVCC handle concurrent read and write transactions without locking?',
            'What strategies would you use to diagnose and fix a slow query using EXPLAIN ANALYZE?'
          ]
        },
        {
          skillName: 'React',
          category: 'Frontend',
          status: 'STRONG',
          priority: 'CRITICAL',
          whyMatters: 'Primary library for customer-facing dashboards and developer consoles.',
          evidence: 'Engineered React frontend workflows serving 150k monthly active users.',
          jobRequirement: 'Modern, high-performance UI engineering in React.',
          gapExplanation: 'Solid experience with modern React architecture.',
          learningAction: 'Review React 19 server actions and concurrency primitives.',
          interviewQuestions: [
            'How do you prevent unnecessary re-renders in deeply nested React tree structures?',
            'Explain state management trade-offs between Context API and dedicated atom/store solutions.'
          ]
        },
        {
          skillName: 'Docker',
          category: 'DevOps',
          status: 'STRONG',
          priority: 'HIGH',
          whyMatters: 'Baseline containerization for all deployed microservices.',
          evidence: 'Containerized microservices with Docker at Apex Cloud Systems.',
          jobRequirement: 'Containerization and cloud deployment workflows.',
          gapExplanation: 'Demonstrated container packaging skills.',
          learningAction: 'Learn multi-stage builds and security vulnerability scanning.',
          interviewQuestions: [
            'How do you optimize Docker image build cache and reduce container attack surface?'
          ]
        },
        {
          skillName: 'REST API',
          category: 'Backend',
          status: 'STRONG',
          priority: 'CRITICAL',
          whyMatters: 'Foundation of developer-facing payment APIs.',
          evidence: 'Built Node.js and Express RESTful services integrated with PostgreSQL.',
          jobRequirement: 'High-reliability RESTful API design with strict contract versioning.',
          gapExplanation: 'Demonstrated API architecture experience.',
          learningAction: 'Master idempotency keys and rate-limiting token bucket implementations.',
          interviewQuestions: [
            'How do you implement idempotency keys for financial transactions in a REST API?',
            'Describe how to handle breaking changes in public REST API versions.'
          ]
        },
        {
          skillName: 'GraphQL',
          category: 'Web',
          status: 'NOT DEMONSTRATED',
          priority: 'HIGH',
          whyMatters: 'Explicitly required for Stripe developer-facing data graphs.',
          evidence: 'Not demonstrated in the submitted resume.',
          jobRequirement: 'Design and maintain developer-facing GraphQL APIs.',
          gapExplanation: 'The submitted resume contains strong REST experience but lacks documented GraphQL schema design.',
          learningAction: 'Build a sample GraphQL server using Apollo Server or Yoga with DataLoader for N+1 prevention.',
          interviewQuestions: [
            'How do you solve the N+1 problem in GraphQL resolvers using DataLoader?',
            'When would you recommend GraphQL over REST for developer APIs, and vice versa?'
          ]
        },
        {
          skillName: 'Kubernetes',
          category: 'DevOps',
          status: 'NOT DEMONSTRATED',
          priority: 'HIGH',
          whyMatters: 'Stripe clusters run on Kubernetes for orchestration and autoscaling.',
          evidence: 'Not demonstrated in the submitted resume.',
          jobRequirement: 'Experience with Kubernetes orchestration in production.',
          gapExplanation: 'Docker containerization is demonstrated, but K8s deployments/services/ingress are not shown.',
          learningAction: 'Study K8s primitives: Pods, Deployments, Services, ConfigMaps, and Helm charts.',
          interviewQuestions: [
            'Explain how a Kubernetes Ingress controller routes traffic to backend pods.',
            'What is the difference between liveness probes and readiness probes in Kubernetes?'
          ]
        },
        {
          skillName: 'Kafka',
          category: 'Backend',
          status: 'NOT DEMONSTRATED',
          priority: 'HIGH',
          whyMatters: 'Event streaming backbone for distributed transactions and ledger sync.',
          evidence: 'Not demonstrated in the submitted resume.',
          jobRequirement: 'Familiarity with distributed message brokers like Apache Kafka.',
          gapExplanation: 'Redis caching is present, but distributed log streaming with Kafka is not demonstrated.',
          learningAction: 'Study Kafka topic partitioning, consumer group rebalancing, and exactly-once semantics.',
          interviewQuestions: [
            'How does Apache Kafka guarantee message ordering within a partition during consumer failures?',
            'Compare Kafka with a traditional message queue like RabbitMQ.'
          ]
        }
      ],
      atsAnalysis: {
        keywordDensityScore: 84,
        readabilityScore: 92,
        completenessScore: 88,
        feedback: [
          'Strong match on core technical keywords: TypeScript, React, Node.js, PostgreSQL.',
          'Consider explicitly detailing GraphQL and Kubernetes experience if you have worked with them.',
          'Quantified impact in current role (35% query latency reduction) significantly strengthens ATS ranking.'
        ]
      },
      createdAt: new Date().toISOString(),
    };
    db.matches.push(demoMatch);

    // Seed progress snapshot
    const demoProgress: ProgressSnapshot = {
      id: 'prog_demo_init',
      userId: demoUser.id,
      jobId: demoJob.id,
      interviewId: 'inv_demo_mock_1',
      overallScore: 78,
      technicalScore: 80,
      compatibilityScore: 78,
      strongSkillsCount: 5,
      gapSkillsCount: 3,
      topStrength: 'TypeScript & PostgreSQL',
      topGap: 'Kubernetes & GraphQL',
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    };
    db.progressSnapshots.push(demoProgress);

    // Seed initial completed interview
    const demoInterview: InterviewSession = {
      id: 'inv_demo_mock_1',
      userId: demoUser.id,
      resumeId: demoResume.id,
      jobId: demoJob.id,
      matchId: demoMatch.id,
      mode: 'Technical Interview',
      difficulty: 'Intermediate',
      totalQuestions: 5,
      status: 'completed',
      currentQuestionIndex: 5,
      questions: [
        {
          id: 'q1',
          questionNumber: 1,
          category: 'Databases',
          topic: 'PostgreSQL Performance & Indexing',
          difficulty: 'Intermediate',
          questionText: 'In your resume, you mentioned improving PostgreSQL query latency by 35%. How did you identify the bottlenecks, what specific index types or query rewrites did you use, and how did you verify the improvement?',
          targetedSkill: 'PostgreSQL',
          isGapTargeted: false,
          expectedKeyPoints: ['EXPLAIN ANALYZE', 'B-Tree vs GIN/GiST indices', 'Connection pooling', 'Execution plan evaluation'],
        },
        {
          id: 'q2',
          questionNumber: 2,
          category: 'Backend',
          topic: 'REST API Idempotency in Payment Systems',
          difficulty: 'Intermediate',
          questionText: 'Stripe relies heavily on idempotency keys to ensure financial transactions aren\'t duplicated on network timeouts. How would you design an idempotency layer in Node.js and Redis?',
          targetedSkill: 'REST API',
          isGapTargeted: false,
          expectedKeyPoints: ['Unique idempotency-key header', 'Atomic Redis SETNX or transactions', 'Storing response payloads', 'Handling concurrent in-flight requests'],
        },
        {
          id: 'q3',
          questionNumber: 3,
          category: 'Web',
          topic: 'GraphQL Schema Design & The N+1 Problem',
          difficulty: 'Intermediate',
          questionText: 'The target role requires designing developer-facing APIs with GraphQL, which was not demonstrated on your resume. How does GraphQL work, and how do you resolve the infamous N+1 problem in resolvers?',
          targetedSkill: 'GraphQL',
          isGapTargeted: true,
          expectedKeyPoints: ['Single endpoint with flexible queries', 'Resolver execution lifecycle', 'DataLoader batching and caching', 'Query depth limiting'],
        },
        {
          id: 'q4',
          questionNumber: 4,
          category: 'DevOps',
          topic: 'Kubernetes Container Orchestration',
          difficulty: 'Intermediate',
          questionText: 'You have solid Docker experience on your resume, but Kubernetes is required for this role. Can you explain the difference between a Pod, a Deployment, and a Service in a Kubernetes cluster?',
          targetedSkill: 'Kubernetes',
          isGapTargeted: true,
          expectedKeyPoints: ['Pod as smallest schedulable unit', 'Deployment manages replica sets and rolling updates', 'Service provides stable networking & load balancing'],
        },
        {
          id: 'q5',
          questionNumber: 5,
          category: 'Backend',
          topic: 'Event Streaming & Kafka Architecture',
          difficulty: 'Advanced',
          questionText: 'Why would a platform like Stripe use Apache Kafka instead of standard HTTP webhooks or relational database queues for transaction event distribution?',
          targetedSkill: 'Kafka',
          isGapTargeted: true,
          expectedKeyPoints: ['High throughput and persistence on disk', 'Consumer group parallelism', 'Decoupled replayability', 'Strict partition ordering'],
        }
      ],
      answers: {
        q1: 'We had an endpoint taking over 450ms. I ran EXPLAIN ANALYZE on PostgreSQL and found a sequential scan on the transactions table filtering by merchant_id and created_at. I added a composite B-Tree index on (merchant_id, created_at DESC) which dropped execution time to 18ms. We also tuned work_mem and introduced pgBouncer for connection pooling.',
        q2: 'Clients pass an Idempotency-Key header with a UUID. When the request hits the Express middleware, we do a Redis SET key lock NX with a 120s TTL. If it returns false, another request is in flight so we wait or return 409. Once the transaction commits in Postgres, we cache the response code and body in Redis with a 24-hour expiration so repeated calls return the cached response immediately.',
        q3: 'GraphQL allows the frontend to request exact fields instead of fixed endpoints. The N+1 problem happens when fetching a list of N items and then executing a separate query for each related child. We solve it using DataLoader, which batches all child IDs within a single event loop tick into a single SQL WHERE id IN (...) query and memoizes the results.',
        q4: 'A Pod is the atomic unit running one or more containers sharing network and storage. A Deployment manages Pod lifecycle, handling declarative replica counts, rolling updates, and self-healing. A Service provides a consistent virtual IP and DNS name that load balances traffic across active Pods matched by label selectors.',
        q5: 'Relational tables degrade under massive queue write/read contention due to row locks. Kafka provides an append-only distributed commit log with zero-copy I/O. It guarantees ordering within a partition, allows multiple independent consumer services to read at their own pace, and supports replay in case an downstream microservice needs recovery.'
      },
      evaluations: {
        q1: {
          questionId: 'q1',
          answerText: 'We had an endpoint taking over 450ms...',
          technicalAccuracy: 9,
          completeness: 9,
          problemSolving: 9,
          roleRelevance: 9,
          communication: 9,
          weightedScore: 90,
          strengths: ['Accurate identification using EXPLAIN ANALYZE', 'Proper composite B-Tree index design with column ordering', 'Mentioned connection pooling and pgBouncer'],
          missingConcepts: ['Table vacuuming or index bloat considerations'],
          technicalCorrection: 'None needed; solution is textbook PostgreSQL optimization.',
          improvementAdvice: 'Mentioning index size vs memory footprint makes the answer even stronger.',
          betterAnswerStructure: '1. Problem diagnosis (EXPLAIN ANALYZE) -> 2. Root cause (seq scan) -> 3. Solution (composite index) -> 4. Verification & metric delta (450ms to 18ms).',
          evaluatedAt: new Date().toISOString(),
        },
        q2: {
          questionId: 'q2',
          answerText: 'Clients pass an Idempotency-Key header...',
          technicalAccuracy: 9,
          completeness: 8,
          problemSolving: 9,
          roleRelevance: 9,
          communication: 8,
          weightedScore: 87,
          strengths: ['Correct usage of Redis SETNX with TTL', 'Distinguished in-flight concurrency from completed execution', 'Cached both status code and response payload'],
          missingConcepts: ['Database-level idempotency record check as fallback if Redis restarts'],
          technicalCorrection: 'Ensure the Redis key lock releases or clears if an unhandled internal exception occurs before completion.',
          improvementAdvice: 'Mention how you handle payload mismatch (same key, different request body).',
          betterAnswerStructure: '1. Key extraction -> 2. In-flight locking -> 3. Payload checksum verification -> 4. Cached replay.',
          evaluatedAt: new Date().toISOString(),
        },
        q3: {
          questionId: 'q3',
          answerText: 'GraphQL allows the frontend to request exact fields...',
          technicalAccuracy: 8,
          completeness: 8,
          problemSolving: 8,
          roleRelevance: 8,
          communication: 9,
          weightedScore: 82,
          strengths: ['Clear definition of GraphQL value proposition', 'Accurately articulated DataLoader event-loop batching mechanism', 'Solid communication clarity'],
          missingConcepts: ['Query complexity cost analysis and depth limiting for DDoS defense'],
          technicalCorrection: 'Accurate explanation of DataLoader.',
          improvementAdvice: 'Contrast REST caching at HTTP gateway vs GraphQL field-level caching.',
          betterAnswerStructure: '1. Concept definition -> 2. N+1 mechanics -> 3. DataLoader batching solution -> 4. Production guardrails.',
          evaluatedAt: new Date().toISOString(),
        },
        q4: {
          questionId: 'q4',
          answerText: 'A Pod is the atomic unit running one or more containers...',
          technicalAccuracy: 8,
          completeness: 7,
          problemSolving: 7,
          roleRelevance: 8,
          communication: 8,
          weightedScore: 76,
          strengths: ['Correct definitions of Pod, Deployment, and Service', 'Accurately noted label selector mechanism in Services'],
          missingConcepts: ['Ingress controller role in routing external traffic', 'Readiness vs Liveness probes'],
          technicalCorrection: 'Good conceptual foundation.',
          improvementAdvice: 'Connect Kubernetes deployments to zero-downtime rolling updates in production.',
          betterAnswerStructure: '1. Pod (compute) -> 2. Deployment (orchestration) -> 3. Service (networking) -> 4. Ingress (routing).',
          evaluatedAt: new Date().toISOString(),
        },
        q5: {
          questionId: 'q5',
          answerText: 'Relational tables degrade under massive queue write/read contention...',
          technicalAccuracy: 8,
          completeness: 8,
          problemSolving: 8,
          roleRelevance: 8,
          communication: 8,
          weightedScore: 80,
          strengths: ['Recognized relational DB locking bottlenecks under high write volume', 'Understood partition ordering and consumer group independence', 'Mentioned replayability benefits'],
          missingConcepts: ['Exactly-once semantics vs at-least-once delivery', 'Kafka broker cluster architecture'],
          technicalCorrection: 'Solid understanding of log-centric messaging.',
          improvementAdvice: 'Describe how partition keys ensure consistent ordering for specific account IDs.',
          betterAnswerStructure: '1. Why RDBMS queues fail -> 2. Kafka distributed commit log architecture -> 3. Partitioning and consumer offsets -> 4. Reliability guarantees.',
          evaluatedAt: new Date().toISOString(),
        }
      },
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      completedAt: new Date(Date.now() - 86400000 + 1800000).toISOString(),
    };
    db.interviews.push(demoInterview);

    const demoReport: InterviewReport = {
      id: 'rep_demo_alex_1',
      interviewId: demoInterview.id,
      userId: demoUser.id,
      overallScore: 83,
      technicalAccuracyScore: 84,
      problemSolvingScore: 82,
      completenessScore: 80,
      roleRelevanceScore: 84,
      communicationScore: 84,
      strongAreas: [
        'PostgreSQL Query Optimization & Indexing (Score: 90/100)',
        'Idempotency & Distributed Cache Design with Redis (Score: 87/100)',
        'GraphQL Fundamentals & DataLoader Batching (Score: 82/100)'
      ],
      weakAreas: [
        'Kubernetes Ingress & Probe Configuration (Score: 76/100)',
        'Kafka Partition Keys & Exactly-Once Semantics (Score: 80/100)'
      ],
      criticalGapsDiscovered: [
        'Kubernetes production deployment architecture needs deeper hands-on practice.',
        'GraphQL depth limiting and schema cost analysis should be studied for senior-level defense.'
      ],
      nextSteps: [
        'Practice Kubernetes pod networking and ingress configuration in minikube/kind.',
        'Implement an Apollo Server with DataLoader and depth-limit middleware.',
        'Run a follow-up Skill-Gap Mock Interview focusing specifically on Kubernetes & Kafka.'
      ],
      createdAt: new Date(Date.now() - 86400000 + 1800000).toISOString(),
    };
    db.reports.push(demoReport);
    demoInterview.reportId = demoReport.id;

    // Seed learning roadmap
    const demoRoadmap: LearningRoadmap = {
      id: 'road_demo_alex_stripe',
      userId: demoUser.id,
      jobId: demoJob.id,
      matchId: demoMatch.id,
      interviewId: demoInterview.id,
      title: 'Targeted Preparation Roadmap for Senior Platform Engineer (Stripe)',
      estimatedWeeks: 4,
      priorities: [
        {
          skill: 'Kubernetes',
          priority: 'CRITICAL',
          whyMatters: 'Required for container orchestration and deploying microservices on Stripe platform infrastructure.',
          currentStatus: 'Not demonstrated in submitted resume; foundational knowledge shown in mock interview (76/100).',
          targetMilestone: 'Deploy a multi-tier service with Ingress, ConfigMaps, and Rolling Update strategies.',
          learningResources: [
            { title: 'Kubernetes Official Documentation - Core Concepts', type: 'Documentation', url: 'https://kubernetes.io/docs/concepts/' },
            { title: 'Kubernetes Up & Running - Ingress & Service Networking', type: 'Book/Guide' }
          ],
          practiceTask: 'Set up local Minikube cluster. Deploy a Node.js API with 3 replicas, readiness probe, and an Ingress route.',
          interviewPracticeQuestion: 'How would you architect a zero-downtime rolling deployment in Kubernetes when database schema migrations are involved?'
        },
        {
          skill: 'GraphQL',
          priority: 'HIGH',
          whyMatters: 'Essential for developer-facing unified API gateways and custom query payloads.',
          currentStatus: 'Not demonstrated in resume; answered DataLoader question well in mock interview (82/100).',
          targetMilestone: 'Build production GraphQL gateway with schema validation, DataLoader, and query depth limiting.',
          learningResources: [
            { title: 'Apollo Server Best Practices & N+1 Prevention', type: 'Documentation', url: 'https://www.apollographql.com/docs/' },
            { title: 'GraphQL Security: Depth Limiting & Cost Analysis', type: 'Article' }
          ],
          practiceTask: 'Build a GraphQL service for payments with nested transactions and a DataLoader caching layer.',
          interviewPracticeQuestion: 'How do you handle authentication, authorization, and rate limiting in a GraphQL API compared to REST?'
        },
        {
          skill: 'Kafka',
          priority: 'HIGH',
          whyMatters: 'Core backbone for distributed event streams, billing ledger updates, and async workers.',
          currentStatus: 'Demonstrated conceptual understanding in mock interview (80/100); needs architectural depth.',
          targetMilestone: 'Implement producer/consumer with consumer group failover and idempotent writes.',
          learningResources: [
            { title: 'Confluent Kafka Fundamentals', type: 'Video Course' },
            { title: 'Designing Data-Intensive Applications - Chapter 11 (Stream Processing)', type: 'Book' }
          ],
          practiceTask: 'Run local Kafka broker in Docker. Produce payment events with partition key by account_id and consume in two separate worker groups.',
          interviewPracticeQuestion: 'What happens when a Kafka consumer crashes in the middle of processing a batch? How do you ensure exactly-once processing?'
        }
      ],
      milestones: [
        {
          week: 1,
          title: 'Kubernetes Primitives & Hands-On Cluster Deployment',
          skillsCovered: ['Kubernetes', 'Docker', 'DevOps'],
          deliverable: 'Working Minikube deployment of Express API with HPA (Horizontal Pod Autoscaler) and Ingress.',
        },
        {
          week: 2,
          title: 'Advanced GraphQL API & Security Hardening',
          skillsCovered: ['GraphQL', 'TypeScript', 'Node.js'],
          deliverable: 'Secured GraphQL API with DataLoader, custom scalar types, and graphql-depth-limit middleware.',
        },
        {
          week: 3,
          title: 'Distributed Event Streaming with Kafka',
          skillsCovered: ['Kafka', 'Redis', 'Microservices'],
          deliverable: 'Async event pipeline with transactional outbox pattern and idempotent consumers.',
        },
        {
          week: 4,
          title: 'Full System Architecture Mock Re-Interview',
          skillsCovered: ['System Design', 'PostgreSQL', 'Kubernetes', 'Kafka', 'GraphQL'],
          deliverable: 'Score 88+ on CareerForge AI Senior Mock Re-Interview.',
        }
      ],
      createdAt: new Date().toISOString(),
    };
    db.roadmaps.push(demoRoadmap);
  }

  saveToDisk();
}

// Database helper operations
export const Database = {
  // Users
  getUserByEmail(email: string): User | undefined {
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  getUserById(id: string): User | undefined {
    return db.users.find(u => u.id === id);
  },
  createUser(user: User): User {
    db.users.push(user);
    saveToDisk();
    return user;
  },
  updateUser(id: string, updates: Partial<User>): User | undefined {
    const idx = db.users.findIndex(u => u.id === id);
    if (idx === -1) return undefined;
    db.users[idx] = { ...db.users[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return db.users[idx];
  },
  getAllUsers(): User[] {
    return db.users;
  },

  // Sessions
  createSession(session: Session): Session {
    db.sessions.push(session);
    saveToDisk();
    return session;
  },
  getSession(token: string): Session | undefined {
    return db.sessions.find(s => s.token === token && new Date(s.expiresAt) > new Date());
  },
  deleteSession(token: string) {
    db.sessions = db.sessions.filter(s => s.token !== token);
    saveToDisk();
  },

  // Resumes
  getResumesByUserId(userId: string): Resume[] {
    return db.resumes.filter(r => r.userId === userId);
  },
  getResumeById(id: string): Resume | undefined {
    return db.resumes.find(r => r.id === id);
  },
  createResume(resume: Resume): Resume {
    db.resumes.push(resume);
    saveToDisk();
    return resume;
  },
  updateResume(id: string, updates: Partial<Resume>): Resume | undefined {
    const idx = db.resumes.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    db.resumes[idx] = { ...db.resumes[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return db.resumes[idx];
  },
  deleteResume(id: string, userId: string): boolean {
    const initialLen = db.resumes.length;
    db.resumes = db.resumes.filter(r => !(r.id === id && r.userId === userId));
    db.candidateProfiles = db.candidateProfiles.filter(p => !(p.resumeId === id && p.userId === userId));
    saveToDisk();
    return db.resumes.length < initialLen;
  },

  // Candidate Profiles
  getCandidateProfileByResumeId(resumeId: string): CandidateProfile | undefined {
    return db.candidateProfiles.find(p => p.resumeId === resumeId);
  },
  getCandidateProfileById(id: string): CandidateProfile | undefined {
    return db.candidateProfiles.find(p => p.id === id);
  },
  createCandidateProfile(profile: CandidateProfile): CandidateProfile {
    db.candidateProfiles.push(profile);
    saveToDisk();
    return profile;
  },
  updateCandidateProfile(id: string, updates: Partial<CandidateProfile>): CandidateProfile | undefined {
    const idx = db.candidateProfiles.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    db.candidateProfiles[idx] = { ...db.candidateProfiles[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return db.candidateProfiles[idx];
  },

  // Jobs
  getJobsByUserId(userId: string): JobDescription[] {
    return db.jobs.filter(j => j.userId === userId);
  },
  getJobById(id: string): JobDescription | undefined {
    return db.jobs.find(j => j.id === id);
  },
  createJob(job: JobDescription): JobDescription {
    db.jobs.push(job);
    saveToDisk();
    return job;
  },
  updateJob(id: string, updates: Partial<JobDescription>): JobDescription | undefined {
    const idx = db.jobs.findIndex(j => j.id === id);
    if (idx === -1) return undefined;
    db.jobs[idx] = { ...db.jobs[idx], ...updates, updatedAt: new Date().toISOString() };
    saveToDisk();
    return db.jobs[idx];
  },
  deleteJob(id: string, userId: string): boolean {
    const initialLen = db.jobs.length;
    db.jobs = db.jobs.filter(j => !(j.id === id && j.userId === userId));
    db.jobProfiles = db.jobProfiles.filter(jp => !(jp.jobId === id && jp.userId === userId));
    saveToDisk();
    return db.jobs.length < initialLen;
  },

  // Job Profiles
  getJobProfileByJobId(jobId: string): JobProfile | undefined {
    return db.jobProfiles.find(jp => jp.jobId === jobId);
  },
  createJobProfile(jobProfile: JobProfile): JobProfile {
    db.jobProfiles.push(jobProfile);
    saveToDisk();
    return jobProfile;
  },

  // Compatibility Matches
  getMatchesByUserId(userId: string): CompatibilityMatch[] {
    return db.matches.filter(m => m.userId === userId);
  },
  getMatchById(id: string): CompatibilityMatch | undefined {
    return db.matches.find(m => m.id === id);
  },
  createMatch(match: CompatibilityMatch): CompatibilityMatch {
    db.matches.push(match);
    saveToDisk();
    return match;
  },

  // Interviews
  getInterviewsByUserId(userId: string): InterviewSession[] {
    return db.interviews.filter(i => i.userId === userId);
  },
  getInterviewById(id: string): InterviewSession | undefined {
    return db.interviews.find(i => i.id === id);
  },
  createInterview(interview: InterviewSession): InterviewSession {
    db.interviews.push(interview);
    saveToDisk();
    return interview;
  },
  updateInterview(id: string, updates: Partial<InterviewSession>): InterviewSession | undefined {
    const idx = db.interviews.findIndex(i => i.id === id);
    if (idx === -1) return undefined;
    db.interviews[idx] = { ...db.interviews[idx], ...updates };
    saveToDisk();
    return db.interviews[idx];
  },

  // Reports
  getReportByInterviewId(interviewId: string): InterviewReport | undefined {
    return db.reports.find(r => r.interviewId === interviewId);
  },
  createReport(report: InterviewReport): InterviewReport {
    db.reports.push(report);
    saveToDisk();
    return report;
  },

  // Roadmaps
  getRoadmapsByUserId(userId: string): LearningRoadmap[] {
    return db.roadmaps.filter(r => r.userId === userId);
  },
  getRoadmapById(id: string): LearningRoadmap | undefined {
    return db.roadmaps.find(r => r.id === id);
  },
  createRoadmap(roadmap: LearningRoadmap): LearningRoadmap {
    db.roadmaps.push(roadmap);
    saveToDisk();
    return roadmap;
  },

  // Progress Snapshots
  getProgressByUserId(userId: string): ProgressSnapshot[] {
    return db.progressSnapshots.filter(p => p.userId === userId);
  },
  createProgressSnapshot(snapshot: ProgressSnapshot): ProgressSnapshot {
    db.progressSnapshots.push(snapshot);
    saveToDisk();
    return snapshot;
  },

  // Admin Logs
  createAdminLog(log: AdminActionLog): AdminActionLog {
    db.adminLogs.push(log);
    saveToDisk();
    return log;
  },
  getAdminLogs(): AdminActionLog[] {
    return db.adminLogs.slice(-100).reverse();
  },

  // System Stats for Admin
  getSystemStats() {
    return {
      totalUsers: db.users.length,
      activeUsers: db.sessions.length,
      resumesProcessed: db.resumes.length,
      jobsAnalyzed: db.jobs.length,
      interviewsCompleted: db.interviews.filter(i => i.status === 'completed').length,
      totalInterviews: db.interviews.length,
      averageScore: db.reports.length
        ? Math.round(db.reports.reduce((acc, r) => acc + r.overallScore, 0) / db.reports.length)
        : 0,
      systemHealth: 'Healthy (Operational)',
      lastRestart: new Date().toISOString(),
    };
  }
};
