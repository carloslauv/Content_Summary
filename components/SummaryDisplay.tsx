'use client';

import { useState } from 'react';
import { SummaryResult, SummarySection } from '@/types';

interface SummaryDisplayProps {
  summary: SummaryResult;
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  youtube: { label: 'YouTube', color: 'bg-red-100 text-red-700' },
  podcast: { label: 'Podcast', color: 'bg-purple-100 text-purple-700' },
  audio: { label: 'Audio', color: 'bg-blue-100 text-blue-700' },
  unknown: { label: 'Content', color: 'bg-gray-100 text-gray-600' },
};

function SectionCard({ section }: { section: SummarySection }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-hbr-border rounded-xl bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-hbr-cream transition-colors group"
      >
        <span className="font-semibold text-hbr-dark text-sm pr-4">{section.title}</span>
        <svg
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className={`overflow-hidden transition-all duration-200 ${open ? 'max-h-[600px]' : 'max-h-0'}`}>
        <div className="px-5 pb-5 border-t border-hbr-border pt-4 space-y-3">
          <p className="text-sm text-gray-600 summary-prose">{section.summary}</p>
          {section.details.length > 0 && (
            <ul className="space-y-2">
              {section.details.map((detail, i) => (
                <li key={i} className="flex gap-3 items-start text-sm text-gray-700">
                  <span className="text-hbr-red mt-1 flex-shrink-0">›</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SummaryDisplay({ summary }: SummaryDisplayProps) {
  const source = SOURCE_LABELS[summary.sourceType] ?? SOURCE_LABELS.unknown;
  const readingTime = summary.wordCount ? Math.ceil(summary.wordCount / 200) : null;

  return (
    <article className="w-full space-y-8">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${source.color}`}>
            {source.label}
          </span>
          {readingTime && (
            <span className="text-xs text-gray-400">{readingTime} min read (original)</span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-hbr-dark leading-tight tracking-tight">
          {summary.title}
        </h1>
      </header>

      {/* TL;DR */}
      <section>
        <div className="bg-hbr-cream border-l-4 border-hbr-red rounded-r-xl px-6 py-5">
          <p className="text-xs font-bold uppercase tracking-widest text-hbr-red mb-3">
            TL;DR
          </p>
          <p className="text-base text-hbr-dark summary-prose leading-relaxed">
            {summary.tldr}
          </p>
        </div>
      </section>

      {/* Key Takeaways */}
      {summary.keyTakeaways?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Key Takeaways
          </h2>
          <ol className="space-y-3">
            {summary.keyTakeaways.map((point, i) => (
              <li key={i} className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-hbr-red text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed pt-0.5">{point}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Deep Dive Sections */}
      {summary.sections?.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
            Deep Dive
          </h2>
          <div className="space-y-2">
            {summary.sections.map((section, i) => (
              <SectionCard key={i} section={section} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
