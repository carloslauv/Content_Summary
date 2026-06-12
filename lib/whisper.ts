import OpenAI from 'openai';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB Whisper limit

export async function transcribeAudio(audioUrl: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured');

  const openai = new OpenAI({ apiKey });

  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch audio: ${response.status} ${response.statusText}`);
  }

  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > MAX_FILE_SIZE) {
    throw new Error('Audio file exceeds 25MB limit for transcription');
  }

  const buffer = await response.arrayBuffer();

  if (buffer.byteLength > MAX_FILE_SIZE) {
    throw new Error('Audio file exceeds 25MB limit for transcription');
  }

  // Determine file extension from URL or content-type
  const urlPath = new URL(audioUrl).pathname;
  const ext = urlPath.match(/\.(mp3|m4a|wav|ogg|opus|mp4|webm)$/i)?.[1] || 'mp3';
  const mimeTypes: Record<string, string> = {
    mp3: 'audio/mpeg',
    m4a: 'audio/mp4',
    wav: 'audio/wav',
    ogg: 'audio/ogg',
    opus: 'audio/opus',
    mp4: 'audio/mp4',
    webm: 'audio/webm',
  };

  const mimeType = mimeTypes[ext.toLowerCase()] || 'audio/mpeg';
  const blob = new Blob([buffer], { type: mimeType });
  const file = new File([blob], `audio.${ext}`, { type: mimeType });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
  });

  return transcription.text;
}
