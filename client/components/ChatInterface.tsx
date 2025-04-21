import React, { useState, useEffect, useRef, JSX } from "react";
import { v4 as uuidv4 } from "uuid";
import MessageBubble from "./MessageBubble";
import { FiSend } from "react-icons/fi";
import { sendChatMessage } from "../src/utils/api";
import PaymentModal from "./PaymentModsal";

interface Message {
  text: string | JSX.Element;
  isBot: boolean;
  timestamp: Date;
}

interface MenuItem {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  number: number;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = localStorage.getItem("sessionId") || uuidv4();
    localStorage.setItem("sessionId", id);
    setSessionId(id);

    const fetchInitMessage = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat/init`);
        const data = await res.json();
        const formattedText = data.response
          .split("\n")
          .map((line: string, index: number) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ));

        setMessages([
          {
            text: (
              <div className="text-gray-700">
                <span role="img" aria-label="robot" className="mr-1">
                  🤖
                </span>
                {formattedText}
              </div>
            ),
            isBot: true,
            timestamp: new Date(),
          },
        ]);
      } catch (err) {
        setMessages([
          {
            text: (
              <div className="text-red-500 italic">
                <span role="img" aria-label="warning" className="mr-1">
                  ⚠️
                </span>
                Failed to load welcome message from the bot. Please try again
                later.
              </div>
            ),
            isBot: true,
            timestamp: new Date(),
          },
        ]);
      }
    };

    fetchInitMessage();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const add = (text: string | JSX.Element, isBot = false) =>
    setMessages((m) => [...m, { text, isBot, timestamp: new Date() }]);

  const send = async () => {
    if (!input.trim()) return;
    add(<div className="text-gray-800">{input}</div>, false);

    try {
      const res = await sendChatMessage(sessionId, input.trim());

      if (res && res.data && Array.isArray(res.data.response)) {
        if (res.data.response.length > 0) {
          add(
            <div className="space-y-3 bg-gray-100 p-3 rounded-lg text-gray-700">
              <h3 className="mb-2 font-semibold text-blue-600 text-lg">
                <span role="img" aria-label="menu" className="mr-1">
                  📜
                </span>
                Menu Items Found:
              </h3>
              <ul>
                {res.data.response.map((item: MenuItem) => (
                  <li key={item._id} className="mb-2">
                    <div className="flex items-center">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="mr-3 rounded w-12 h-12 object-cover"
                        />
                      )}
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-gray-500 text-sm">
                          {item.description}
                        </p>
                        <p className="font-medium text-blue-700">
                          ₦{item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 text-sm italic">
                Let me know if you'd like to order anything!
              </p>
            </div>,
            true
          );
        } else {
          add(
            <div className="bg-gray-100 p-2 rounded-md text-gray-700 italic">
              <span role="img" aria-label="sad" className="mr-1">
                😞
              </span>
              No menu items found matching your request.
            </div>,
            true
          );
        }
      } else if (res && res.data && typeof res.data.response === "string") {
        const formattedText = res.data.response
          .split("\n")
          .map((line: string, index: number) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ));
        add(
          <div className="bg-gray-100 p-3 rounded-lg text-gray-700">
            {formattedText}
          </div>,
          true
        );
      } else {
        console.error("Unexpected response structure", res);
        add(
          <div className="bg-red-100 p-2 rounded-md text-red-700 italic">
            <span role="img" aria-label="error" className="mr-1">
              ⚠️
            </span>
            An unexpected error occurred while processing the response.
          </div>,
          true
        );
      }

      setInput("");
    } catch (error) {
      console.error("Error sending chat message:", error);
      add(
        <div className="bg-red-100 p-2 rounded-md text-red-700 italic">
          <span role="img" aria-label="error" className="mr-1">
            ❌
          </span>
          Failed to send message. Please check your connection and try again.
        </div>,
        true
      );
    }
  };

  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 shadow-xl mx-auto my-8 rounded-lg max-w-md h-[calc(100vh-4rem)] overflow-hidden">
      <div className="bg-indigo-200 p-4 border-indigo-300 border-b text-center">
        <h2 className="font-semibold text-indigo-700 text-lg">
          <span role="img" aria-label="chat" className="mr-1">
            💬
          </span>
          Chat with our Assistant
        </h2>
        <p className="text-indigo-500 text-sm">We're here to help!</p>
      </div>
      <div className="flex-1 space-y-3 bg-transparent p-3 overflow-y-auto">
        {messages.map((m, i) => (
          <MessageBubble key={i} text={m.text} isBot={m.isBot} />
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center bg-gray-50 p-3 border-gray-200 border-t">
        <input
          className="flex-1 p-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Type your message..."
        />
        <button
          onClick={send}
          className="bg-blue-500 hover:bg-blue-600 ml-2 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 text-white"
        >
          <FiSend className="w-5 h-5" />
        </button>
      </div>
      {showModal && (
        <PaymentModal
          isOpen={showModal}
          total={0}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            add(
              <div className="bg-green-100 p-2 rounded-md text-green-700">
                <span role="img" aria-label="success" className="mr-1">
                  ✅
                </span>
                Payment successful! Thank you for your order.
              </div>,
              true
            );
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatInterface;
