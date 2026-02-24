import React from "react";

const MessageBubble = ({ message, isMe }) => {
  const messageDate = new Date(message.createdAt);
  const time = messageDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = messageDate.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year:
      messageDate.getFullYear() !== new Date().getFullYear()
        ? "numeric"
        : undefined,
  });
  const fullDateTime = `${date} at ${time}`;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`flex max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2`}
      >
        {/* Avatar */}
        {!isMe && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-green-500/30">
            {message.sender?.profilePicture ? (
              <img
                src={message.sender.profilePicture}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-green-400 font-bold">
                {message.sender?.name?.[0] || "U"}
              </div>
            )}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`bg-gray-900/80 backdrop-blur-sm border ${isMe ? "border-green-500/50 rounded-tr-none" : "border-green-500/20 rounded-tl-none"} rounded-xl p-3 shadow-lg`}
        >
          {!isMe && (
            <p className="text-xs text-green-400 font-semibold mb-1">
              {message.sender?.name || "Unknown"}
            </p>
          )}

          <p className="text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>

          <div className="flex justify-end mt-2">
            <span
              className="text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-help"
              title={fullDateTime}
            >
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
