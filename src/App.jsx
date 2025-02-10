import { useState } from 'react';
import { Window } from "./components/window";
import { ResponseSection } from "./components/responseSection";

function App() {
  const [showResponse, setShowResponse] = useState(false);
  const [responseData, setResponseData] = useState({
    result: null,
    analysis: null,
    isLoading: false,
    error: null
  });

  const handleResponse = (data) => {
    setResponseData(data);
    setShowResponse(true);
  };

  const handleContinue = () => {
    setShowResponse(false);
  };

  const handleNewChat = () => {
    setShowResponse(false);
  };

  return (
    <>
      {!showResponse ? (
        <div className="min-h-screen bg-zinc-900 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">
                GenZ Speak Translator
              </h1>
              <p className="text-zinc-400 text-sm">
                Transform your messages into authentic GenZ style ✨
              </p>
            </div>
            <Window onResponse={handleResponse} />
          </div>
        </div>
      ) : (
        <ResponseSection
          {...responseData}
          onContinue={handleContinue}
          onNewChat={handleNewChat}
        />
      )}
    </>
  );
}

export default App;
