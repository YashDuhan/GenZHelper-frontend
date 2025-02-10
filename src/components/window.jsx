import { useState, useEffect } from "react";
import { API_BASE_URL } from "../api/api-config";
import { OutputWindow } from "./outputWindow";
import { MessageCard } from "./messageCard";
import Select from 'react-select';
import { convertText } from '../api/api';

export function Window() {
  const styleOptions = [
    { value: 'emojis', label: '😊 Use Emojis' },
    { value: 'shortforms', label: '👍 Include Shortforms' },
    { value: 'no_punctuation', label: '🚫 Skip Punctuation' },
    { value: 'all_lowercase', label: '⬇️ All Lowercase' },
    { value: 'extra_letters', label: '➕ Extra Letters (periodddd)' },
    { value: 'internet_slang', label: '🌐 Internet Slang' },
    { value: 'text_faces', label: '(◕‿◕) Text Faces' },
    { value: 'random_caps', label: 'RaNdOm CaPs' },
  ];

  const [formData, setFormData] = useState({
    latest_prompt: "",
    prev_convo: [],
    general_instruction: "",
    genziness_score: 5,
    mood: "happy",
    gender: "male",
    objective: "casual",
    style_tags: [],
    word_limit: 50  // Add default word limit
  });

  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState("me");
  const [result, setResult] = useState("");
  const [conversation, setConversation] = useState([]);
  const [showOutput, setShowOutput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const MAX_MESSAGES = 50;

  const handleAddMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && conversation.length < MAX_MESSAGES) {
      addToConversation(newMessage.trim(), messageType);
      setNewMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setShowOutput(true);

    const requestData = {
      latest_prompt: formData.latest_prompt,
      prev_convo: conversation.map(msg => [msg.text, msg.sender]),
      general_instruction: formData.general_instruction,
      genziness_score: formData.genziness_score,
      mood: formData.mood,
      gender: formData.gender,
      objective: formData.objective,
      style_tags: formData.style_tags,
      word_limit: formData.word_limit
    };

    try {
      const data = await convertText(requestData);
      setResult(data.response);
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate response');
      setShowOutput(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    // Add current message to conversation
    if (result) {
      // Add the AI's response as "me"
      addToConversation(result, "me");
    }
    
    // Only reset the message fields, keep other settings
    setFormData(prev => ({ 
      ...prev, 
      latest_prompt: "", 
      general_instruction: "" 
    }));
    setResult("");
    setAnalysis(null);
    setShowOutput(false);
  };

  const handleNewChat = () => {
    // Clear everything
    localStorage.removeItem('genzSettings');
    setFormData({
      latest_prompt: "",
      prev_convo: [],
      general_instruction: "",
      genziness_score: 5,
      mood: "happy",
      gender: "male",
      objective: "casual",
      style_tags: [],
      word_limit: 50
    });
    setConversation([]);
    setResult("");
    setAnalysis(null);
    setShowOutput(false);
  };

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('genzSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setFormData(prev => ({ ...prev, ...settings }));
    }
  }, []);

  const addToConversation = (text, sender = "me") => {
    setConversation([...conversation, { text, sender, id: Date.now() }]);
  };

  const addGeneratedMessage = () => {
    if (result) {
      addToConversation(result, "them");
      setResult("");
    }
  };

  const removeMessage = (id) => {
    setConversation(conversation.filter(msg => msg.id !== id));
  };

  const getGenzLevelLabel = (score) => {
    if (score <= 2) return { text: "Barely GenZ", color: "text-blue-400" };
    if (score <= 4) return { text: "Mild GenZ", color: "text-cyan-400" };
    if (score <= 6) return { text: "Medium GenZ", color: "text-green-400" };
    if (score <= 8) return { text: "Very GenZ", color: "text-purple-400" };
    return { text: "Ultra GenZ", color: "text-pink-400" };
  };

  const clearSavedResponses = () => {
    setConversation([]);
    setFormData(prev => ({
      ...prev,
      prev_convo: []
    }));
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4">
      {!showOutput ? (
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-zinc-800 rounded-lg p-3 sm:p-6 shadow-xl border border-zinc-700">
            <div className="flex justify-end mb-6">
              <button
                onClick={clearSavedResponses}
                className="px-3 py-1 text-sm bg-red-600/20 text-red-400 rounded-md 
                         hover:bg-red-600/30 transition-colors duration-200 
                         flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Clear Saved Responses</span>
              </button>
            </div>

            {/* Previous Messages Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <label className="text-zinc-200 font-medium">Previous Messages</label>
                    <span className="text-xs px-2 py-1 bg-zinc-700 text-zinc-300 rounded-full">Optional</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    Add context from your previous conversation to get more relevant responses
                  </p>
                </div>
                <span className="text-xs text-zinc-400">
                  {conversation.length}/{MAX_MESSAGES} messages
                </span>
              </div>
              
              {/* Message Input with Sender Toggle */}
              {conversation.length < MAX_MESSAGES && (
                <form onSubmit={handleAddMessage} className="space-y-3">
                  <div className="flex gap-2 p-2 bg-zinc-900/50 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setMessageType("me")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
                                ${messageType === "me" 
                                  ? "bg-blue-600 text-white" 
                                  : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"}`}
                    >
                      Me
                    </button>
                    <button
                      type="button"
                      onClick={() => setMessageType("them")}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200
                                ${messageType === "them" 
                                  ? "bg-purple-600 text-white" 
                                  : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"}`}
                    >
                      Them
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Add message context here (avoid sensitive information)..."
                      className="flex-1 p-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 
                                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-zinc-700 text-zinc-200 rounded-lg hover:bg-zinc-600 
                               transition-colors duration-200"
                    >
                      Add
                    </button>
                  </div>
                </form>
              )}

              {/* Previous Messages Display */}
              {conversation.length > 0 && (
                <div className="mt-3 space-y-2 max-h-60 overflow-y-auto p-2 bg-zinc-900/50 rounded-lg">
                  {conversation.map((msg) => (
                    <MessageCard
                      key={msg.id}
                      message={msg}
                      onRemove={() => removeMessage(msg.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Word Limit Control */}
            <div className="mb-6">
              <label className="block mb-2">
                <span className="text-zinc-200 font-medium">Response Length</span>
                <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-full ml-2">Optional</span>
                <span className="text-xs text-zinc-400 block mt-1">
                  Maximum words in the response (10-100)
                </span>
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={formData.word_limit}
                  onChange={(e) => setFormData({ ...formData, word_limit: parseInt(e.target.value) })}
                  className="flex-1 h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-zinc-200 min-w-[4rem] text-center">
                  {formData.word_limit} words
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2">
                  <span className="text-zinc-200 font-medium">Your Message</span>
                  <span className="text-red-400 ml-1">*</span>
                  <span className="text-xs text-zinc-400 block mt-1">
                    What message would you like to convert?
                  </span>
                </label>
                <textarea
                  value={formData.latest_prompt}
                  onChange={(e) => setFormData({ ...formData, latest_prompt: e.target.value })}
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-32"
                  placeholder="Type your message here..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">
                    <span className="text-zinc-200 font-medium">Recipient Type</span>
                    <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-full ml-2">Optional</span>
                    <span className="text-xs text-zinc-400 block mt-1">
                      Who are you texting?
                    </span>
                  </label>
                  <select
                    value={formData.objective}
                    onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="crush">Crush</option>
                    <option value="girlfriend">Girlfriend/Boyfriend</option>
                    <option value="bestfriend">Best Friend</option>
                    <option value="friend">Casual Friend</option>
                    <option value="flirty">Someone You're Flirting With</option>
                    <option value="groupchat">Group Chat</option>
                    <option value="social">Social Media Audience</option>
                    <option value="meme">Meme Community</option>
                    <option value="roast">Friend to Roast</option>
                    <option value="casual">Casual Acquaintance</option>
                    <option value="formal">Professional Contact</option>
                    <option value="parents">Parents/Family</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2">
                    <span className="text-zinc-200 font-medium">Recipient's Gender</span>
                    <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-full ml-2">Optional</span>
                    <span className="text-xs text-zinc-400 block mt-1">
                      Who will receive this message?
                    </span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 
                              focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="groupchat">Group/Multiple People</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2">
                  <span className="text-zinc-200 font-medium">GenZ-iness Level</span>
                  <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-full ml-2">Optional</span>
                  <span className="text-xs text-zinc-400 block mt-1">
                    Default is medium level
                  </span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={formData.genziness_score}
                    onChange={(e) => setFormData({ ...formData, genziness_score: parseInt(e.target.value) })}
                    className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-zinc-700"
                  />
                  <span className={`font-medium w-24 text-center ${getGenzLevelLabel(formData.genziness_score).color}`}>
                    {getGenzLevelLabel(formData.genziness_score).text}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <label className="block mb-2">
                  <span className="text-zinc-200 font-medium">Style Options</span>
                  <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-full ml-2">Optional</span>
                  <span className="text-xs text-zinc-400 block mt-1">
                    Select multiple styles to customize your message
                  </span>
                </label>
                <Select
                  isMulti
                  options={styleOptions}
                  value={formData.style_tags}
                  onChange={(selected) => setFormData({ ...formData, style_tags: selected })}
                  className="style-select"
                  classNamePrefix="select"
                  placeholder="Select style options..."
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#2563eb',
                      primary75: '#3b82f6',
                      primary50: '#60a5fa',
                      primary25: '#1e293b',
                      neutral0: '#18181b',
                      neutral5: '#27272a',
                      neutral10: '#3f3f46',
                      neutral20: '#52525b',
                      neutral30: '#71717a',
                      neutral40: '#a1a1aa',
                      neutral50: '#d4d4d8',
                      neutral60: '#e4e4e7',
                      neutral70: '#f4f4f5',
                      neutral80: '#fafafa',
                      neutral90: '#ffffff',
                    },
                    borderRadius: 6,
                  })}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: '#18181b',
                      borderColor: '#3f3f46',
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#18181b',
                      border: '1px solid #3f3f46',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#27272a' : '#18181b',
                      color: '#f4f4f5',
                      ':active': {
                        backgroundColor: '#3f3f46',
                      },
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#27272a',
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: '#f4f4f5',
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: '#a1a1aa',
                      ':hover': {
                        backgroundColor: '#27272a',
                        color: '#ef4444',
                      },
                    }),
                    input: (base) => ({
                      ...base,
                      color: '#f4f4f5',
                    }),
                  }}
                />
                <p className="text-xs text-zinc-400 mt-1">
                  Select multiple style options to customize your GenZ text
                </p>
              </div>

              <div>
                <label className="block mb-2">
                  <span className="text-zinc-200 font-medium">Mood/Tone</span>
                  <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-full ml-2">Optional</span>
                  <span className="text-xs text-zinc-400 block mt-1">
                    How should your message come across?
                  </span>
                </label>
                <select
                  value={formData.mood}
                  onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="happy">Happy & Positive</option>
                  <option value="excited">Excited & Enthusiastic</option>
                  <option value="flirty">Flirty & Playful</option>
                  <option value="sad">Sad & Down</option>
                  <option value="angry">Angry & Frustrated</option>
                  <option value="sarcastic">Sarcastic & Witty</option>
                  <option value="chill">Chill & Relaxed</option>
                  <option value="energetic">Energetic & Hyped</option>
                </select>
              </div>

              <div>
                <label className="block mb-2">
                  <span className="text-zinc-200 font-medium">Special Instructions</span>
                  <span className="text-xs px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded-full ml-2">Optional</span>
                  <span className="text-xs text-zinc-400 block mt-1">
                    Any additional context or specific requirements
                  </span>
                </label>
                <textarea
                  value={formData.general_instruction}
                  onChange={(e) => setFormData({ ...formData, general_instruction: e.target.value })}
                  className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-20"
                  placeholder="Any specific style or context you want to add..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium
                         hover:bg-blue-700 transition-colors duration-200 
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-800"
              >
                Convert to GenZ
              </button>
            </form>
          </div>
        </div>
      ) : (
        // Output Section - Now takes full width
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={() => setShowOutput(false)}
            className="px-3 py-1 text-sm bg-zinc-700 text-zinc-200 rounded-md 
                     hover:bg-zinc-600 transition-colors duration-200 
                     flex items-center gap-2 mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Form</span>
          </button>
          <OutputWindow 
            result={result}
            analysis={analysis}
            isLoading={isLoading}
            error={error}
            onContinue={handleContinue}
            onNewChat={handleNewChat}
          />
        </div>
      )}
    </div>
  );
}
