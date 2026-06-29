import { YoutubeTranscript } from 'youtube-transcript';
import ytdl from '@distube/ytdl-core';
import OpenAI from 'openai';

const MAX_AUDIO_SIZE = 25 * 1024 * 1024; // 25MB Whisper limit

export async function getYouTubeTranscript(videoId: string): Promise<{ text: string; title: string }> {
  // Try caption-based transcript first (fast, free)
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    const text = transcript.map((t) => t.text).join(' ');
    if (text.trim().length > 50) {
      return { text, title: '' };
    }
  } catch {
    // Captions unavailable — fall through to Whisper
  }

  // Fallback: download audio and transcribe with Whisper
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'This video has no captions. Add an OPENAI_API_KEY to enable audio transcription as a fallback.'
    );
  }

  const url = `https://www.youtube.com/watch?v=${videoId}`;

  if (!ytdl.validateURL(url)) {
    throw new Error('Invalid YouTube URL');
  }

  // Get audio-only format, preferring smaller files
  const info = await ytdl.getInfo(url);
  const audioFormat = ytdl.chooseFormat(info.formats, {
    quality: 'lowestaudio',
    filter: 'audioonly',
  });

  if (!audioFormat) {
    throw new Error('No audio stream available for this video');
  }

  // Fetch the audio (respect 25MB Whisper limit)
  const audioRes = await fetch(audioFormat.url);
  if (!audioRes.ok) throw new Error('Failed to download audio from YouTube');

  const buffer = await audioRes.arrayBuffer();
  if (buffer.byteLength > MAX_AUDIO_SIZE) {
    throw new Error(
      'Video audio exceeds 25MB — try a shorter video or one with captions enabled'
    );
  }

  const openai = new OpenAI({ apiKey });
  const ext = audioFormat.container || 'mp4';
  const blob = new Blob([buffer], { type: `audio/${ext}` });
  const file = new File([blob], `audio.${ext}`, { type: `audio/${ext}` });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
  });

  return { text: transcription.text, title: info.videoDetails.title };
}
