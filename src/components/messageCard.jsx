export function MessageCard({ message, onRemove }) {
  return (
    <div className={`flex items-start space-x-2 p-2 rounded-lg ${
      message.sender === "me" 
        ? "bg-blue-900/30 border border-blue-800/50" 
        : "bg-purple-900/30 border border-purple-800/50"
    }`}>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-zinc-400">
            {message.sender === "me" ? "You" : "Their Response"}
          </span>
        </div>
        <p className="text-zinc-100 text-sm mt-1">{message.text}</p>
      </div>
      <button
        onClick={onRemove}
        className="text-zinc-400 hover:text-zinc-200 p-1"
      >
        ×
      </button>
    </div>
  );
} 