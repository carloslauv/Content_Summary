import Anthropic from '@anthropic-ai/sdk';
import { SummaryResult, SourceType, FrameworkResult } from '@/types';

const getClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured');
  return new Anthropic({ apiKey });
};

export async function summarizeTranscript(
  transcript: string,
  sourceType: SourceType,
  url: string
): Promise<SummaryResult> {
  const client = getClient();

  const prompt = `You are an expert content analyst who writes executive summaries in the style of Harvard Business Review — crisp, insight-driven, and actionable.

Given the following transcript from a ${sourceType} (${url}), produce a structured summary.

TRANSCRIPT:
${transcript.slice(0, 100000)}

Return ONLY valid JSON with this exact structure:
{
  "title": "descriptive title for this content",
  "tldr": "2-3 sentence executive summary capturing the core insight and why it matters",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3", "takeaway 4", "takeaway 5"],
  "sections": [
    {
      "title": "section title",
      "summary": "1-2 sentence summary of this section",
      "details": ["detail point 1", "detail point 2", "detail point 3"]
    }
  ]
}

Guidelines:
- TL;DR should read like an HBR opening paragraph — what happened, why it matters, what to do
- Key takeaways should be actionable insights, not just descriptions
- Sections should map to natural topic shifts in the content (aim for 3-6 sections)
- Write for a senior executive audience: no filler, maximum signal`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Claude response');

  const parsed = JSON.parse(jsonMatch[0]);
  return { ...parsed, sourceType, wordCount: transcript.split(/\s+/).length };
}

export async function extractFramework(
  transcript: string,
  sourceType: SourceType,
  url: string
): Promise<FrameworkResult | null> {
  const client = getClient();

  const prompt = `You are an expert at identifying structured frameworks, models, and methodologies from content.

Analyze this transcript from a ${sourceType} (${url}) and extract any explicit framework, step-by-step process, model, or structured methodology the speaker presents.

TRANSCRIPT:
${transcript.slice(0, 100000)}

If a framework exists, return ONLY valid JSON in this exact structure:
{
  "name": "The exact name of the framework or methodology",
  "description": "1-2 sentences describing what this framework is for and when to use it",
  "steps": [
    {
      "label": "Step name or category label (word-for-word if named by speaker)",
      "description": "What this step involves — use the speaker's own words where possible",
      "subpoints": ["specific sub-point 1", "specific sub-point 2"]
    }
  ]
}

If NO clear framework, model, or structured process exists in the content, return ONLY the word: null

Rules:
- Extract word-for-word when the speaker names steps or categories explicitly
- Preserve the speaker's exact terminology
- Include all sub-components, criteria, or sub-steps mentioned
- Do not invent structure that isn't in the content`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') return null;

  const text = content.text.trim();
  if (text === 'null' || text.toLowerCase().includes('no clear framework')) return null;

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return null;

  try {
    return JSON.parse(jsonMatch[0]) as FrameworkResult;
  } catch {
    return null;
  }
}
