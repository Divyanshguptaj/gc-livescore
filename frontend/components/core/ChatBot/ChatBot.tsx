// components/ChatBotIcon.tsx
import React, { useState } from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import ChatBotModal from './ChatBotModal';

const ChatBotIcon = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div 
        className="fixed bottom-4 right-4 p-4 bg-blue-600 rounded-full text-white shadow-lg cursor-pointer z-50"
        onClick={toggleModal}
      >
        <FiMessageCircle size={30} />
      </div>

      {/* Chatbot Modal */}
      {isModalOpen && <ChatBotModal closeModal={toggleModal} />}
    </>
  );
};

export default ChatBotIcon;
