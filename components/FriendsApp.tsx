
import React, { useState, useEffect } from 'react';
import { Friend } from '../types.ts';
import { GoogleGenAI, Type } from "@google/genai";

interface FriendsAppProps {
    onSelectFriend: (friend: Friend) => void;
    userFriendCode: string;
}

const FriendsApp: React.FC<FriendsAppProps> = ({ onSelectFriend, userFriendCode }) => {
  const [friendsList, setFriendsList] = useState<Friend[]>(() => {
    try {
        const saved = localStorage.getItem('pandaFriendsList');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        return [];
    }
  });
  const [friendCodeInput, setFriendCodeInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('pandaFriendsList', JSON.stringify(friendsList));
  }, [friendsList]);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendCodeInput.trim() || isLoading) return;
    
    const code = friendCodeInput.trim().toUpperCase();

    if (code === userFriendCode.toUpperCase()) {
      setError("Tu ne peux pas t'ajouter toi-même !");
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (friendsList.some(f => f.code === code)) {
      setError('Cet ami est déjà dans ta liste !');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Génère un nom de panda unique et une personnalité en une seule phrase courte pour un ami panda virtuel dont le code est "${code}". La personnalité doit être distincte et intéressante, comme celle d'un vrai joueur. Réponds UNIQUEMENT avec un objet JSON au format : {"name": "...", "personality": "..."}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              personality: { type: Type.STRING }
            },
            required: ['name', 'personality']
          }
        }
      });
      
      const newFriendData = JSON.parse(response.text);
      const personalityWithPrefix = `Tu es ${newFriendData.name}. ${newFriendData.personality}. Tes réponses doivent être courtes et dans le style d'un SMS.`;

      const newFriend: Friend = {
        code: code,
        name: newFriendData.name,
        personality: personalityWithPrefix,
      };

      setFriendsList(prev => [...prev, newFriend]);
      setFriendCodeInput('');

    } catch (err) {
      console.error("Error generating friend:", err);
      setError("Impossible de créer cet ami. Réessaye.");
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleAddFriend} className="mb-4">
        <p className="text-sm text-center mb-2 text-[#A76B79]">Ouvre un portail vers un autre panda !</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={friendCodeInput}
            onChange={(e) => setFriendCodeInput(e.target.value)}
            placeholder="Code Ami d'un autre joueur"
            className="flex-grow bg-white border border-[#FAD1DC] rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#E583A0] focus:outline-none placeholder-[#B48491]"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-[#E583A0] text-white rounded-lg font-semibold hover:bg-[#d86f8f] transition-colors disabled:bg-gray-400 disabled:cursor-wait"
            disabled={isLoading}
          >
            {isLoading ? '...' : 'Ouvrir'}
          </button>
        </div>
        {error && <p className="text-red-500 text-xs text-center mt-1">{error}</p>}
      </form>
      
      <div className="flex-grow overflow-y-auto space-y-2">
        {friendsList.length === 0 ? (
          <div className="text-center text-[#B48491] mt-8">
            <p>Aucun portail ouvert.</p>
            <p className="text-xs mt-2">Partage ton code et ajoute d'autres joueurs !</p>
          </div>
        ) : (
          friendsList.map(friend => (
            <button key={friend.code} onClick={() => onSelectFriend(friend)} className="w-full flex items-center bg-[#FDF3F6] p-3 rounded-lg border border-[#F7A6B9]/50 hover:bg-white transition-colors text-left">
              <div className="w-10 h-10 flex items-center justify-center bg-white rounded-full mr-3 text-2xl">
                🐼
              </div>
              <div>
                <p className="font-bold text-[#B48491]">{friend.name}</p>
                 <p className="text-xs text-[#A76B79] opacity-80">{friend.code}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendsApp;