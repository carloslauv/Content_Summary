import { SourceType } from '@/types';

export function detectSourceType(url: string): SourceType {
  if (/youtube\.com\/watch|youtu\.be\//.test(url)) return 'youtube';
  if (/\.mp3|\.m4a|\.wav|\.ogg|\.opus/.test(url)) return 'audio';
  if (/\.xml|rss|feed/.test(url)) return 'podcast';
  return 'unknown';
}

export function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  return match ? match[1] : null;
}

export function estimateReadingTime(wordCount: number): string {
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  if (minutes < 60) return `${minutes} min read`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m read` : `${hours}h read`;
}

export function formatSourceLabel(sourceType: SourceType): string {
  const labels: Record<SourceType, string> = {
    youtube: 'YouTube',
    podcast: 'Podcast',
    audio: 'Audio',
    unknown: 'Content',
  };
  return labels[sourceType];
}
