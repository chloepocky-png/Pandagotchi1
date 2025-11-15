
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Friend, ChatMessage } from '../types.ts';

interface FriendChatProps {
    friend: Friend;
}

const FriendChat: React.FC<FriendChatProps> = ({ friend }) => {
  const chatHistoryKey = `friendChatHistory_${friend.code}`;

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const savedMessages = localStorage.getItem(chatHistoryKey);
      if (savedMessages) {
        return JSON.parse(savedMessages);
      }
    } catch (error) {
      console.error("Could not load messages from localStorage", error);
    }
    return [{ sender: 'panda', text: `Salut ! Je suis ${friend.name}. Content de te parler !` }];
  });
  
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(chatHistoryKey, JSON.stringify(messages));
    } catch (error) {
      console.error("Could not save messages to localStorage", error);
    }
  }, [messages, chatHistoryKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: userInput.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    // Artificial delay to simulate human response time
    setTimeout(async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const systemInstruction = friend.personality;

        // Filter out initial empty messages if any, and prepare history for Gemini
        const geminiHistory = newMessages
          .filter(msg => msg.text.trim() !== '')
          .map(msg => ({
            role: msg.sender === 'panda' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: geminiHistory,
          config: {
            systemInstruction: systemInstruction,
          },
        });

        const pandaResponseText = response.text;
        const pandaMessage: ChatMessage = { sender: 'panda', text: pandaResponseText };
        setMessages(prev => [...prev, pandaMessage]);
      } catch (error) {
        console.error("Error sending message to Gemini:", error);
        const errorMessage: ChatMessage = { sender: 'panda', text: "Hmm, je ne sais pas quoi dire..." };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }, Math.random() * 1500 + 500); // Delay between 0.5s and 2s
  };
  
  return (
    <div className="flex flex-col h-full bg-[#FDF3F6] rounded-lg">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] p-3 rounded-2xl ${
                msg.sender === 'user'
                  ? 'bg-[#89CFF0] text-white rounded-br-lg'
                  : 'bg-white text-[#A76B79] rounded-bl-lg'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="max-w-[75%] p-3 rounded-2xl bg-white text-[#A76B79] rounded-bl-lg">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0s'}}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></span>
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-2 border-t border-[#F7A6B9]/50 flex items-center bg-white rounded-b-lg">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={`Parler à ${friend.name}...`}
          disabled={isLoading}
          className="flex-grow bg-transparent border-none focus:ring-0 text-sm text-[#A76B79] placeholder-[#B48491]"
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="ml-2 px-4 py-2 bg-[#89CFF0] text-white rounded-full font-bold text-sm
                     hover:bg-[#78b6d4] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default FriendChat;