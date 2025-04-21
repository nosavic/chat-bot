import React, { JSX } from "react";

interface MessageBubbleProps {
  text: string | JSX.Element;
  isBot: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, isBot }) => {
  return (
    <div
      className={`flex w-full mb-2 ${isBot ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`rounded-lg p-3 text-white max-w-xs break-words ${
          isBot ? "bg-gray-300 text-gray-800" : "bg-blue-200"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default MessageBubble;
