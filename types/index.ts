export type SourceType = 'youtube' | 'podcast' | 'audio' | 'unknown';

export interface SummaryResult {
  title: string;
  sourceType: SourceType;
  tldr: string;
  keyTakeaways: string[];
  sections: SummarySection[];
  wordCount?: number;
  durationEstimate?: string;
}

export interface SummarySection {
  title: string;
  summary: string;
  details: string[];
}

export interface SummarizeRequest {
  url: string;
}

export interface SummarizeResponse {
  success: boolean;
  data?: SummaryResult;
  error?: string;
}
