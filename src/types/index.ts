export interface UploadResponse {
  fileName: string;
  pageCount: number;
  extractedText: string;
  extractedAt: string;
}

export interface SkillDetail {
  skill: string;
  detail: string;
}

export interface Suggestion {
  title: string;
  detail: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResponse {
  matchScore: number;
  summary: string;
  scoreBreakdown: {
    technicalSkills: number;
    experience: number;
    softSkills: number;
  };
  matchedHardSkills: SkillDetail[];
  missingHardSkills: SkillDetail[];
  matchedSoftSkills: SkillDetail[];
  experienceAnalysis: string;
  suggestions: Suggestion[];
  verdict: string;
}
