import { YoutubeTranscript } from 'youtube-transcript';

export async function getYouTubeTranscript(videoId: string): Promise<{ text: string; title: string }> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const text = transcript.map((t) => t.text).join(' ');
    return { text, title: '' };
  } catch (error) {
    throw new Error(
      `Failed to fetch YouTube transcript: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
