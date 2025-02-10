import { useState } from 'react';

export function ResponseSection({ result, analysis, isLoading, error, onContinue, onNewChat }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-zinc-800 rounded-lg p-6 shadow-xl border border-zinc-700">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              <p className="text-zinc-300">Generating your GenZ response...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-900 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-zinc-800 rounded-lg p-6 shadow-xl border border-zinc-700">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="text-red-400 text-xl">⚠️</div>
              <p className="text-red-400">Oops! Something went wrong</p>
              <p className="text-zinc-400 text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-zinc-900 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-zinc-800 rounded-lg p-6 shadow-xl border border-zinc-700 space-y-6">
          {/* Response Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-zinc-100">GenZ Translation</h2>
              <button
                onClick={handleCopy}
                className="px-3 py-1 text-sm bg-zinc-700 text-zinc-200 rounded-md hover:bg-zinc-600
                         transition-colors duration-200 flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <span>Copied!</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Copy</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            <div className="bg-zinc-900 rounded-lg p-4">
              <p className="text-zinc-100 whitespace-pre-wrap">{result}</p>
            </div>
          </div>

          {/* Analysis Section */}
          {analysis && (
            <>
              {/* ... existing analysis section ... */}
            </>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onContinue}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <span>Continue Chat</span>
              <span>→</span>
            </button>
            <button
              onClick={onNewChat}
              className="px-4 py-2 bg-zinc-700 text-zinc-200 rounded-lg hover:bg-zinc-600 
                       transition-colors duration-200"
            >
              Start New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 