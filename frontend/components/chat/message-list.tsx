"use client";

import MessageBubble from "./message-bubble";

export default function MessageList({
  messages,
  isTyping,
  typingUser,
  currentUserId,
}: any) {
  return (
    <div className="space-y-4">
      {messages.map((m) => {
        const align =
          m.user._id === currentUserId || m.user === currentUserId
            ? "right"
            : "left";
        return (
          <MessageBubble
            key={m._id || m.createdAt}
            message={m}
            align={align}
            currentUserId={currentUserId}
          />
        );
      })}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2 max-w-xs">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
