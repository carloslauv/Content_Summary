'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  { text: 'Fetching content...', icon: '🔗' },
  { text: 'Extracting transcript...', icon: '📝' },
  { text: 'Analyzing key themes...', icon: '🔍' },
  { text: 'Generating executive summary...', icon: '✍️' },
  { text: 'Structuring insights...', icon: '📊' },
  { text: 'Almost there...', icon: '⚡' },
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev < MESSAGES.length - 1 ? prev + 1 : prev));
    }, 4000);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 3;
      });
    }, 500);

    return () => {
      clearInterval(messageTimer);
      clearInterval(progressTimer);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto py-16">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-3 text-hbr-dark mb-3">
          <span className="text-2xl">{MESSAGES[messageIndex].icon}</span>
          <span className="text-lg font-medium">{MESSAGES[messageIndex].text}</span>
        </div>
        <p className="text-sm text-gray-400">This may take 30–90 seconds for long content</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-hbr-border rounded-full h-1 mb-10 overflow-hidden">
        <div
          className="bg-hbr-red h-1 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(progress, 90)}%` }}
        />
      </div>

      {/* Skeleton preview */}
      <div className="space-y-6">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-6 w-3/4" />
          <div className="skeleton h-4 w-1/2" />
        </div>

        {/* TL;DR skeleton */}
        <div className="border border-hbr-border rounded-xl p-5 space-y-2 bg-white">
          <div className="skeleton h-4 w-24 mb-3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-4/5" />
        </div>

        {/* Key takeaways skeleton */}
        <div className="space-y-2">
          <div className="skeleton h-4 w-32 mb-3" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="skeleton h-5 w-5 rounded-full flex-shrink-0 mt-0.5" />
              <div className="skeleton h-4 flex-1" style={{ width: `${70 + Math.random() * 25}%` }} />
            </div>
          ))}
        </div>

        {/* Sections skeleton */}
        <div className="space-y-3">
          <div className="skeleton h-4 w-28 mb-3" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-hbr-border rounded-xl p-4 space-y-2 bg-white">
              <div className="skeleton h-4 w-48" />
              <div className="skeleton h-3 w-full" />
              <div className="skeleton h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
