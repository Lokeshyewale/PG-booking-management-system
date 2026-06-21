import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Phone, Video, MoreVertical } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ChatModal = ({ broker, isOpen, onClose }) => {
  const { darkMode } = useApp();
  const [message, setMessage] = useState([]);

  const [messages, setMessages] = useState([
    {
      id: '1',
      senderId: broker.id,
      senderName: broker.name,
      message: `Hello! I'm ${broker.name}. How can I help you find the perfect PG accommodation today?`,
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isUser: false
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      message: message.trim(),
      timestamp: new Date(),
      isUser: true
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    setTimeout(() => {
      const responses = [
        "Thank you for your message! I'll help you find the best PG options.",
        "Let me check available properties for you.",
        "I have some great options for you!",
        "I understand your requirement. Let me assist you.",
        "I can arrange a visit if you'd like."
      ];

      const brokerResponse = {
        id: (Date.now() + 1).toString(),
        senderId: broker.id,
        senderName: broker.name,
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        isUser: false
      };

      setMessages(prev => [...prev, brokerResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`w-full max-w-md h-[600px] ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-2xl border shadow-2xl flex flex-col`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center space-x-3">
            <img
              src={broker.image}
              alt={broker.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className={darkMode ? 'text-white font-semibold' : 'font-semibold'}>
                {broker.name}
              </h3>
              <p className="text-sm text-gray-500">
                {broker.area}, {broker.city}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className="max-w-[80%]">
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    msg.isUser
                      ? 'bg-purple-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {!msg.isUser && (
                <img
                  src={broker.image}
                  alt={broker.name}
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-full border dark:bg-gray-700 dark:text-white"
            />

            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="p-2 bg-purple-600 text-white rounded-full disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;