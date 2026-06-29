export type SourceType = 'youtube' | 'podcast' | 'audio' | 'unknown';

export interface SummarySection {
  title: string;
  summary: string;
  details: string[];
}

export interface FrameworkStep {
  label: string;
  description: string;
  subpoints?: string[];
}

export interface FrameworkResult {
  name: string;
  description: string;
  steps: FrameworkStep[];
}

export interface SummaryResult {
  title: string;
  sourceType: SourceType;
  tldr: string;
  keyTakeaways: string[];
  sections: SummarySection[];
  wordCount?: number;
  durationEstimate?: string;
  framework?: FrameworkResult | null;
  transcript?: string;
}

export interface SummarizeRequest {
  url: string;
}

export interface SummarizeResponse {
  success: boolean;
  data?: SummaryResult;
  error?: string;
}

export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  sourceType: string;
  summary: SummaryResult;
  savedAt: number;
}
