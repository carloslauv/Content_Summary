'use client';

import { useState } from 'react';
import UrlForm from '@/components/UrlForm';
import SummaryDisplay from '@/components/SummaryDisplay';
import LoadingState from '@/components/LoadingState';
import ErrorDisplay from '@/components/ErrorDisplay';
import { SummaryResult } from '@/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setSummary(null);
    setError(null);

    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to generate summary');
      } else {
        setSummary(data.data);
      }
    } catch {
      setError('Network error — please check your connection and try again');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSummary(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {!summary && !isLoading && (
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-hbr-dark mb-4 tracking-tight">
            Executive Intelligence,
            <br />
            <span className="text-hbr-red">Instantly</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Paste a YouTube video, podcast RSS feed, or direct audio URL. Get an HBR-style
            executive summary in seconds.
          </p>
        </div>
      )}

      {!isLoading && !summary && (
        <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}

      {isLoading && <LoadingState />}

      {error && !isLoading && (
        <>
          <ErrorDisplay message={error} onRetry={handleReset} />
          <div className="mt-6">
            <UrlForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        </>
      )}

      {summary && !isLoading && (
        <div>
          <button
            onClick={handleReset}
            className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-hbr-red transition-colors group"
          >
            <svg
              className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Summarize another URL
          </button>
          <SummaryDisplay summary={summary} />
        </div>
      )}
    </div>
  );
}
