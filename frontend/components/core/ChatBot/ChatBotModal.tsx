// components/ChatBotModal.tsx
import React, { useState } from 'react';
import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

interface ChatBotModalProps {
  closeModal: () => void;
}

const ChatBotModal: React.FC<ChatBotModalProps> = ({ closeModal }) => {
  const [userMessage, setUserMessage] = useState('');
  const [responses, setResponses] = useState<string[]>([]);

  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      // Show the user message
      setResponses([...responses, `You: ${userMessage}`]);

      try {
        // Send the message to OpenAI API
        const res = await axios.post(`${BASE_URL}/user/chatbot`,
          {
            model: "gpt-3.5-turbo", // or "gpt-4"
            messages: [{ role: 'user', content: userMessage }],
          },
          {
            headers: {
              'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
              'Content-Type': 'application/json',
            },
          }
        );

        // Add the response to the conversation
        const botMessage = res.data.choices[0].message.content;
        setResponses((prevResponses) => [
          ...prevResponses,
          `Bot: ${botMessage}`,
        ]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
      }

      // Clear the user input field
      setUserMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-transparent z-50">
      <div className="bg-white rounded-lg p-4 w-72 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Cricket Bot</h2>
          <button onClick={closeModal} className="text-xl font-bold text-gray-600">&times;</button>
        </div>
        <div className="mt-4 space-y-3 h-56 overflow-y-auto">
          {responses.map((response, index) => (
            <div key={index} className="text-sm text-gray-800">
              {response}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center">
          <input 
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Ask a question..."
          />
          <button 
            onClick={handleSendMessage}
            className="ml-2 p-2 bg-blue-600 text-white rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBotModal;
