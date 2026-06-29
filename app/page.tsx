'use client';

import { useState } from 'react';
import UrlForm from '@/components/UrlForm';
import OutputTabs from '@/components/OutputTabs';
import LoadingState from '@/components/LoadingState';
import ErrorDisplay from '@/components/ErrorDisplay';
import HistoryPanel from '@/components/HistoryPanel';
import { SummaryResult } from '@/types';
import { saveToHistory } from '@/lib/history';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const handleSubmit = async (url: string) => {
    setIsLoading(true);
    setSummary(null);
    setError(null);
    setCurrentUrl(url);

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
        saveToHistory(url, data.data);
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
    setCurrentUrl('');
  };

  const handleHistorySelect = (historySummary: SummaryResult) => {
    setSummary(historySummary);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* History toggle — always visible */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowHistory(true)}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-hbr-red transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Saved sessions
        </button>
      </div>

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
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-hbr-red transition-colors group"
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
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 hover:text-hbr-red transition-colors truncate max-w-xs"
              >
                {currentUrl}
              </a>
            )}
          </div>
          <OutputTabs summary={summary} />
        </div>
      )}

      {showHistory && (
        <HistoryPanel
          onSelect={handleHistorySelect}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}
