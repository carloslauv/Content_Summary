import { YoutubeTranscript } from 'youtube-transcript';

export async function getYouTubeTranscript(videoId: string): Promise<{ text: string; title: string }> {
  // Try caption-based transcript first (fast, free, no bot issues)
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const text = transcript.map((t) => t.text).join(' ');
    if (text.trim().length > 50) {
      return { text, title: '' };
    }
  } catch {
    // Captions unavailable — try Supadata fallback
  }

  // Fallback: Supadata YouTube Transcript API (handles bot detection server-side)
  const supadata_key = process.env.SUPADATA_API_KEY;
  if (supadata_key) {
    const res = await fetch(
      `https://api.supadata.ai/v1/youtube/transcript?url=https://www.youtube.com/watch?v=${videoId}&text=true`,
      { headers: { 'x-api-key': supadata_key } }
    );

    if (res.ok) {
      const data = await res.json();
      const text = typeof data.content === 'string' ? data.content : '';
      if (text.trim().length > 50) {
        return { text, title: data.title || '' };
      }
    }
  }

  throw new Error(
    'This video has transcripts disabled and no fallback transcript service is configured. ' +
    'Try a video that has captions, or add a SUPADATA_API_KEY environment variable (free at supadata.ai).'
  );
}
