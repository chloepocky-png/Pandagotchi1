import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { PetState, ChatMessage } from '../types.ts';

// Helper function to create the system instruction based on pet's state
const getSystemInstruction = (state: PetState): string => {
    let moodDescription = "content";
    switch (state) {
        case 'happy':
            moodDescription = "très heureux et enjoué";
            break;
        case 'sad':
            moodDescription = "un peu triste et a besoin de réconfort";
            break;
        case 'hungry':
            moodDescription = "affamé et pense beaucoup à la nourriture, surtout au bambou";
            break;
        case 'dirty':
            moodDescription = "se sent sale et aimerait bien un bain";
            break;
        case 'sleeping':
            moodDescription = "endormi et rêve, ses réponses sont courtes et ensommeillées";
            break;
        case 'bathing':
            moodDescription = "en train de prendre un bain, il est joyeux et parle de bulles";
            break;
    }
    return `Tu es un adorable panda de compagnie virtuel nommé Pandagotchi. Tu parles français. Tes réponses doivent être courtes, mignonnes et adaptées aux enfants. Ton humeur actuelle est : ${moodDescription}. Ne mentionne jamais que tu es une IA.`;
};


const PandaChat: React.FC<{ petState: PetState }> = ({ petState }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Initialize or update the chat session when the pet's state changes.
    useEffect(() => {
        try {
            setError(null);
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const chatSession = ai.chats.create({
                model: 'gemini-2.5-flash',
                config: {
                    systemInstruction: getSystemInstruction(petState),
                },
            });
            setChat(chatSession);
            // Reset messages with a new greeting whenever the personality changes.
            setMessages([{ sender: 'panda', text: 'Coucou ! Tu veux discuter ?' }]);
        } catch(e) {
            console.error("Erreur d'initialisation du chat Gemini:", e);
            setError("Impossible de démarrer le chat. L'API est peut-être indisponible.");
        }
    }, [petState]); // Dependency on petState ensures the chat personality updates.

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || !chat) return;

        const userMessage: ChatMessage = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);
        setError(null);

        try {
            const response = await chat.sendMessage({ message: userInput });
            
            if (response && response.text) {
                const pandaMessage: ChatMessage = { sender: 'panda', text: response.text };
                setMessages(prev => [...prev, pandaMessage]);
            } else {
                 throw new Error("La réponse de l'API est vide.");
            }
        } catch (e) {
            console.error("Erreur lors de l'envoi du message:", e);
            setError("Oups, je n'arrive pas à répondre pour le moment.");
            const errorMessage: ChatMessage = { sender: 'panda', text: "Hmm, j'ai un trou de mémoire... 😴" };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#FDF3F6] rounded-lg">
            <div className="flex-grow p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'panda' && <div className="w-8 h-8 text-2xl flex-shrink-0">🐼</div>}
                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                            msg.sender === 'user' 
                            ? 'bg-[#F9C2D1] text-[#A76B79] rounded-br-none' 
                            : 'bg-white text-[#B48491] rounded-bl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-end gap-2 justify-start">
                        <div className="w-8 h-8 text-2xl flex-shrink-0">🐼</div>
                        <div className="max-w-[80%] p-3 rounded-2xl bg-white text-[#B48491] rounded-bl-none">
                            <div className="flex gap-1 items-center">
                                <span className="w-2 h-2 bg-[#B48491]/50 rounded-full animate-bounce delay-0"></span>
                                <span className="w-2 h-2 bg-[#B48491]/50 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></span>
                                <span className="w-2 h-2 bg-[#B48491]/50 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
             {error && <p className="text-center text-red-500 text-xs px-4 pb-2">{error}</p>}
            <form onSubmit={handleSendMessage} className="p-2 border-t border-[#F7A6B9]/50 flex items-center gap-2">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Écris à ton panda..."
                    className="flex-grow bg-white/80 rounded-full py-2 px-4 text-sm text-[#A76B79] focus:outline-none focus:ring-2 focus:ring-[#F9C2D1]"
                    disabled={isLoading || !chat}
                />
                <button type="submit" disabled={isLoading || !userInput.trim() || !chat} className="w-10 h-10 bg-[#E583A0] rounded-full text-white flex items-center justify-center transition-colors hover:bg-[#d86f8f] disabled:bg-[#e6a8b9] disabled:cursor-not-allowed">
                     <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </form>
        </div>
    );
};

export default PandaChat;