export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  portfolio: string;
  title: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string; // Text field, will be rendered as paragraphs or bullet points
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  gpa?: string;
  graduationDate: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  certifications: string[];
  languages: string[];
  projects: ProjectItem[];
}

export type TemplateType = "modern" | "executive" | "minimal" | "corporate" | "creative" | "student";

export interface ResumeDocument {
  id: string;
  title: string;
  templateType: TemplateType;
  updatedAt: string;
  data: ResumeData;
  userId?: string;
}

export interface CoverLetterDocument {
  id: string;
  title: string;
  companyName: string;
  hiringManager?: string;
  jobDescription: string;
  tone: "Professional" | "Friendly" | "Confident";
  generatedContent: string;
  updatedAt: string;
}

export type UserPlan = "free" | "pro";

export interface UserAccount {
  id?: string;
  email: string;
  displayName: string;
  plan: UserPlan;
  resumesCount?: number;
  lettersCount?: number;
  aiTokensUsed?: number;
}

export interface ActivityLog {
  id: string;
  type: "create_resume" | "optimize_resume" | "generate_cover" | "improve_bullet" | "download";
  details: string;
  timestamp: string;
}

export interface FeedbackItem {
  id: string;
  email: string;
  category: "feature" | "bug" | "other";
  message: string;
  timestamp: string;
  status: "pending" | "resolved";
}

export interface AIOptimizationReport {
  resumeScore: number;
  atsScore: number;
  grammarScore: number;
  impactScore: number;
  weakWordingSuggestions: string[];
  grammarSuggestions: string[];
  atsSuggestions: string[];
  keyWordSuggestions: string[];
}

export interface JobMatchReport {
  matchPercentage: number;
  extractedKeywords: string[];
  missingSkills: string[];
  suggestedAdditions: string[];
  strengthAnalysis: string;
}
