'use client';

import { useState, FormEvent } from 'react';

interface UrlFormProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  { label: 'YouTube', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { label: 'Podcast RSS', url: 'https://feeds.simplecast.com/example' },
  { label: 'Audio file', url: 'https://example.com/podcast.mp3' },
];

export default function UrlForm({ onSubmit, isLoading }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const canSubmit = url.trim().length > 0 && isValidUrl(url.trim()) && !isLoading;

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div
          className={`relative flex items-center bg-white rounded-xl border-2 transition-all duration-200 shadow-sm ${
            focused
              ? 'border-hbr-red shadow-md'
              : 'border-hbr-border hover:border-gray-300'
          }`}
        >
          <div className="pl-4 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Paste a YouTube, podcast RSS, or audio URL..."
            className="flex-1 px-4 py-4 bg-transparent text-hbr-dark placeholder-gray-400 focus:outline-none text-sm sm:text-base"
            disabled={isLoading}
            autoFocus
          />
          <div className="pr-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                canSubmit
                  ? 'bg-hbr-red text-white hover:bg-red-700 active:scale-95'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Summarize
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-2 justify-center">
        <span className="text-xs text-gray-400">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setUrl(ex.url)}
            className="text-xs px-3 py-1 rounded-full border border-hbr-border text-gray-500 hover:border-hbr-red hover:text-hbr-red transition-colors bg-white"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        Supports YouTube videos, podcast RSS feeds, .mp3 / .m4a / .wav files.
        <br />
        Audio transcription via OpenAI Whisper — max 25MB.
      </p>
    </div>
  );
}
