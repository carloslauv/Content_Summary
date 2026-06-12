'use client';

import { useState } from 'react';
import { SummaryResult, SummarySection } from '@/types';
import { estimateReadingTime, formatSourceLabel } from '@/lib/utils';

interface SummaryDisplayProps {
  summary: SummaryResult;
}

function SectionCard({ section, index }: { section: SummarySection; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="border border-hbr-border rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-hbr-red text-white text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="font-semibold text-hbr-dark">{section.title}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-5 border-t border-hbr-border">
          <p className="text-gray-600 text-sm summary-prose mt-4 mb-4">{section.summary}</p>
          {section.details && section.details.length > 0 && (
            <ul className="space-y-2">
              {section.details.map((detail, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-hbr-red" />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

const SOURCE_COLORS: Record<string, string> = {
  youtube: 'bg-red-100 text-red-700 border-red-200',
  podcast: 'bg-purple-100 text-purple-700 border-purple-200',
  audio: 'bg-blue-100 text-blue-700 border-blue-200',
  unknown: 'bg-gray-100 text-gray-700 border-gray-200',
};

const SOURCE_ICONS: Record<string, string> = {
  youtube: '▶',
  podcast: '🎙',
  audio: '🔊',
  unknown: '📄',
};

export default function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const sourceColorClass = SOURCE_COLORS[summary.sourceType] || SOURCE_COLORS.unknown;
  const sourceIcon = SOURCE_ICONS[summary.sourceType] || SOURCE_ICONS.unknown;
  const readingTime = summary.wordCount ? estimateReadingTime(summary.wordCount) : null;

  return (
    <article className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${sourceColorClass}`}
          >
            <span>{sourceIcon}</span>
            {formatSourceLabel(summary.sourceType)}
          </span>
          {readingTime && (
            <span className="text-xs text-gray-400 px-3 py-1 rounded-full border border-hbr-border bg-white">
              {summary.wordCount?.toLocaleString()} words · {readingTime}
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-hbr-dark leading-tight tracking-tight">
          {summary.title}
        </h1>
      </div>

      {/* TL;DR */}
      <div className="relative bg-white border-l-4 border-hbr-red rounded-r-xl p-6 shadow-sm">
        <div className="absolute -top-3 left-4">
          <span className="bg-hbr-red text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
            TL;DR
          </span>
        </div>
        <p className="text-gray-800 leading-relaxed summary-prose mt-1">{summary.tldr}</p>
      </div>

      {/* Key Takeaways */}
      {summary.keyTakeaways && summary.keyTakeaways.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-hbr-red mb-4">
            Key Takeaways
          </h2>
          <div className="bg-white border border-hbr-border rounded-xl p-6">
            <ol className="space-y-3">
              {summary.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-hbr-red text-hbr-red text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 leading-relaxed">{takeaway}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Deep Dive Sections */}
      {summary.sections && summary.sections.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-hbr-red mb-4">
            Deep Dive
          </h2>
          <div className="space-y-3">
            {summary.sections.map((section, i) => (
              <SectionCard key={i} section={section} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-hbr-border flex items-center justify-between text-xs text-gray-400">
        <span>Generated by Claude AI · HBR-style executive analysis</span>
        {summary.wordCount && (
          <span>Source transcript: {summary.wordCount.toLocaleString()} words</span>
        )}
      </div>
    </article>
  );
}
