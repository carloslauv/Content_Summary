'use client';

import { FrameworkResult } from '@/types';

interface FrameworkDisplayProps {
  framework: FrameworkResult | null | undefined;
}

export default function FrameworkDisplay({ framework }: FrameworkDisplayProps) {
  if (!framework) {
    return (
      <div className="py-16 text-center text-gray-400">
        <svg className="w-10 h-10 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="font-medium">No structured framework detected</p>
        <p className="text-sm mt-1">This content doesn&apos;t present an explicit step-by-step model or methodology.</p>
      </div>
    );
  }

  return (
    <article className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-hbr-dark">{framework.name}</h2>
        <p className="text-gray-600 mt-2 leading-relaxed">{framework.description}</p>
      </div>

      <div className="space-y-3">
        {framework.steps.map((step, i) => (
          <div key={i} className="border border-hbr-border rounded-xl bg-white overflow-hidden">
            <div className="flex items-start gap-4 px-5 py-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-hbr-red text-white text-sm font-bold flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-hbr-dark">{step.label}</h3>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">{step.description}</p>
                {step.subpoints && step.subpoints.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {step.subpoints.map((pt, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-hbr-red" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
