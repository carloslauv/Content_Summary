import { NextRequest, NextResponse } from 'next/server';
import { detectSourceType, extractYouTubeId } from '@/lib/utils';
import { getYouTubeTranscript } from '@/lib/youtube';
import { transcribeAudio } from '@/lib/whisper';
import { summarizeTranscript, extractFramework } from '@/lib/claude';

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'A valid URL is required' },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    const sourceType = detectSourceType(url);
    let transcript = '';

    if (sourceType === 'youtube') {
      const videoId = extractYouTubeId(url);
      if (!videoId) {
        return NextResponse.json(
          { success: false, error: 'Could not extract YouTube video ID from URL' },
          { status: 400 }
        );
      }
      const result = await getYouTubeTranscript(videoId);
      transcript = result.text;
    } else if (sourceType === 'podcast') {
      const rssRes = await fetch(url, {
        headers: { 'User-Agent': 'ContentSummarizer/1.0' },
      });
      if (!rssRes.ok) throw new Error(`Failed to fetch RSS feed: ${rssRes.status}`);
      const rssText = await rssRes.text();
      const audioUrlMatch = rssText.match(/enclosure[^>]+url="([^"]+)"/);
      if (!audioUrlMatch) throw new Error('No audio enclosure found in RSS feed');
      transcript = await transcribeAudio(audioUrlMatch[1]);
    } else {
      transcript = await transcribeAudio(url);
    }

    if (!transcript || transcript.trim().length < 100) {
      throw new Error('Could not extract sufficient transcript from this URL.');
    }

    // Run summary and framework extraction in parallel
    const [summary, framework] = await Promise.all([
      summarizeTranscript(transcript, sourceType, url),
      extractFramework(transcript, sourceType, url),
    ]);

    return NextResponse.json({
      success: true,
      data: { ...summary, framework, transcript },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('Summarize API error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
