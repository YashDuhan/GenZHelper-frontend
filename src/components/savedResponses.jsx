import { useState } from 'react';

export function SavedResponses({ responses }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!responses.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-zinc-200">Previous Responses</h3>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {responses.map((item) => (
          <div key={item.id} className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">
                {new Date(item.timestamp).toLocaleString()}
              </span>
              <button
                onClick={() => handleCopy(item.response, item.id)}
                className="px-2 py-1 text-xs bg-zinc-700 text-zinc-200 rounded-md 
                         hover:bg-zinc-600 transition-colors duration-200 flex items-center gap-1"
              >
                {copiedId === item.id ? (
                  <>
                    <span>Copied!</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Copy</span>
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
            <div className="text-sm text-zinc-300 mb-2">{item.prompt}</div>
            <div className="bg-zinc-900 rounded p-3 text-zinc-100">{item.response}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 