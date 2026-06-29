'use client';

import { useEffect, useState } from 'react';
import { HistoryEntry, SummaryResult } from '@/types';
import { getHistory, deleteHistoryEntry, clearHistory } from '@/lib/history';

const SOURCE_ICONS: Record<string, string> = {
  youtube: '▶',
  podcast: '🎙',
  audio: '🔊',
  unknown: '📄',
};

const SOURCE_COLORS: Record<string, string> = {
  youtube: 'bg-red-100 text-red-700',
  podcast: 'bg-purple-100 text-purple-700',
  audio: 'bg-blue-100 text-blue-700',
  unknown: 'bg-gray-100 text-gray-600',
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface HistoryPanelProps {
  onSelect: (summary: SummaryResult) => void;
  onClose: () => void;
}

export default function HistoryPanel({ onSelect, onClose }: HistoryPanelProps) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteHistoryEntry(id);
    setEntries(getHistory());
  };

  const handleClearAll = () => {
    clearHistory();
    setEntries([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-sm bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-hbr-border">
          <h2 className="font-semibold text-hbr-dark">Saved Sessions</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-hbr-dark transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto">
          {entries.length === 0 ? (
            <div className="py-16 text-center text-gray-400 px-6">
              <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium">No saved sessions yet</p>
              <p className="text-sm mt-1">Summarize a URL to save it here automatically.</p>
            </div>
          ) : (
            <ul className="divide-y divide-hbr-border">
              {entries.map((entry) => (
                <li key={entry.id} className="group">
                  <button
                    onClick={() => { onSelect(entry.summary); onClose(); }}
                    className="w-full text-left px-5 py-4 hover:bg-hbr-cream transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 ${SOURCE_COLORS[entry.sourceType] || SOURCE_COLORS.unknown}`}>
                        {SOURCE_ICONS[entry.sourceType] || '📄'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-hbr-dark line-clamp-2 leading-snug">{entry.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(entry.savedAt)}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 hover:text-red-500 p-1"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {entries.length > 0 && (
          <div className="px-5 py-4 border-t border-hbr-border">
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear all sessions
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
