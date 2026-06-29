'use client';

import { useState } from 'react';
import { SummaryResult } from '@/types';
import SummaryDisplay from './SummaryDisplay';
import FrameworkDisplay from './FrameworkDisplay';
import DownloadButtons from './DownloadButtons';

interface OutputTabsProps {
  summary: SummaryResult;
}

type Tab = 'summary' | 'framework' | 'transcript';

export default function OutputTabs({ summary }: OutputTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>('summary');

  const tabs: { id: Tab; label: string; badge?: string }[] = [
    { id: 'summary', label: 'Summary' },
    { id: 'framework', label: 'Framework', badge: summary.framework ? '✓' : undefined },
    { id: 'transcript', label: 'Transcript' },
  ];

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-1 mb-6 bg-hbr-cream rounded-xl p-1 border border-hbr-border">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
              activeTab === tab.id
                ? 'bg-white text-hbr-dark shadow-sm border border-hbr-border'
                : 'text-gray-500 hover:text-hbr-dark'
            }`}
          >
            {tab.label}
            {tab.badge && (
              <span className="text-xs text-green-600 font-bold">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'summary' && <SummaryDisplay summary={summary} />}

        {activeTab === 'framework' && (
          <FrameworkDisplay framework={summary.framework} />
        )}

        {activeTab === 'transcript' && (
          <div>
            {summary.transcript ? (
              <div className="bg-white border border-hbr-border rounded-xl p-6 max-h-[600px] overflow-y-auto">
                <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">
                  Full Transcript · {summary.wordCount?.toLocaleString()} words
                </p>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {summary.transcript}
                </pre>
              </div>
            ) : (
              <div className="py-16 text-center text-gray-400">
                <p>Transcript not available for this content.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Download buttons — always visible below tabs */}
      <div className="mt-8">
        <DownloadButtons summary={summary} />
      </div>
    </div>
  );
}
