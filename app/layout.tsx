import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Content Summarizer — HBR-Style Executive Summaries',
  description: 'Transform YouTube videos, podcasts, and audio into crisp executive summaries powered by Claude AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-hbr-cream antialiased">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-hbr-border bg-white">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-hbr-red rounded-sm flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CS</span>
                </div>
                <span className="font-semibold text-hbr-dark tracking-tight">Content Summarizer</span>
              </div>
              <span className="text-xs text-gray-400 hidden sm:block">Powered by Claude AI</span>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-hbr-border bg-white mt-16">
            <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
              Content Summarizer — Executive intelligence from any audio or video source
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
