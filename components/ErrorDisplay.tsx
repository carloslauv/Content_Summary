interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 mb-1">Unable to generate summary</h3>
            <p className="text-sm text-red-700">{message}</p>
            <div className="mt-4 space-y-1 text-xs text-red-600">
              <p className="font-medium">Common issues:</p>
              <ul className="list-disc list-inside space-y-0.5 ml-1">
                <li>YouTube video has no captions/subtitles enabled</li>
                <li>Audio file exceeds 25MB Whisper limit</li>
                <li>RSS feed doesn&apos;t contain audio enclosures</li>
                <li>Missing API keys in environment variables</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onRetry}
            className="px-4 py-2 text-sm font-medium text-red-700 hover:text-red-800 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            Try a different URL
          </button>
        </div>
      </div>
    </div>
  );
}
