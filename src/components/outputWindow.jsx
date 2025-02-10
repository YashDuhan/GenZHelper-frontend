import React, { useState } from 'react';

export function OutputWindow({ result, analysis, isLoading, error, onContinue, onNewChat }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-800 rounded-lg p-3 sm:p-6 shadow-xl border border-zinc-700">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-zinc-300">Generating response...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-800 rounded-lg p-3 sm:p-6 shadow-xl border border-zinc-700">
        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!result || !analysis) {
    console.log('Missing result or analysis:', { result, analysis });
    return (
      <div className="bg-zinc-800 rounded-lg p-6 shadow-xl border border-zinc-700">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-yellow-400 text-xl">⚠️</div>
          <p className="text-yellow-400">Invalid Response Format</p>
          <p className="text-zinc-400 text-sm">Please try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Response Section */}
      <div className="bg-zinc-800 rounded-lg p-3 sm:p-6 shadow-xl border border-zinc-700">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-100">GenZ Translation</h2>
            <span className="text-xs text-zinc-400">
              {result?.split(' ').length} words
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-sm bg-zinc-700 text-zinc-200 rounded-md hover:bg-zinc-600
                     transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
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
        <div className="bg-zinc-800 rounded-lg p-3 sm:p-6 shadow-xl border border-zinc-700">
          <h3 className="text-base sm:text-lg font-medium text-zinc-200 mb-4">Message Analysis</h3>
          {/* Mood and Likeability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-900/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Mood</h3>
              <p className="text-zinc-100">{analysis.mood}</p>
            </div>
            <div className="bg-zinc-900/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-2">Likeability</h3>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-400">{analysis.likeability}%</span>
                <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${analysis.likeability}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="space-y-4">
            {Object.entries(analysis.userInsights).map(([key, value]) => (
              <div key={key}>
                <h4 className="text-xs font-medium text-zinc-500 mb-1">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </h4>
                <p className="text-sm text-zinc-300">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="bg-zinc-800 rounded-lg p-3 sm:p-6 shadow-xl border border-zinc-700">
        <div className="space-y-3 sm:space-y-4">
          {/* Add tooltip container */}
          <div className="text-xs text-zinc-400 bg-zinc-900/50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>
                Clicking "Continue Chat" will add your message and this AI response to the conversation history. 
                Your settings (style, mood, etc.) will be preserved for the next message.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={onContinue}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 flex items-center justify-center gap-3 group"
            >
              <div className="text-left">
                <span className="block font-medium">Continue Chat</span>
                <span className="text-xs text-blue-200/80">Add to conversation & write next message</span>
              </div>
              <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                   fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
            <button
              onClick={onNewChat}
              className="px-4 py-3 bg-zinc-700 text-zinc-200 rounded-lg hover:bg-zinc-600 
                       transition-colors duration-200 flex flex-col items-center justify-center"
            >
              <span className="block font-medium">Start New</span>
              <span className="text-xs text-zinc-400">Clear history & settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
