'use client';

import { SummaryResult, HistoryEntry } from '@/types';

const STORAGE_KEY = 'content_summary_history';
const MAX_ENTRIES = 20;

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function saveToHistory(url: string, summary: SummaryResult): HistoryEntry {
  const entry: HistoryEntry = {
    id: generateId(),
    url,
    title: summary.title,
    sourceType: summary.sourceType,
    summary,
    savedAt: Date.now(),
  };

  const existing = getHistory();
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return entry;
}

export function getHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function deleteHistoryEntry(id: string): void {
  const updated = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
