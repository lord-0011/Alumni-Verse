import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { getMessages } from '../api'; 
import { Send } from 'lucide-react';

const ChatWindow = ({ connection }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatEndRef = useRef(null);
  const currentUserId = localStorage.getItem('userId');
  const currentUserRole = localStorage.getItem('userRole');

  // 1. Improved recipient logic to handle all connection types
  const getRecipient = () => {
    if (connection.student) {
      return currentUserRole === 'alumni' ? connection.student : connection.alumni;
    }
    return connection.requester?._id === currentUserId 
      ? connection.recipient 
      : connection.requester;
  };

  const recipient = getRecipient();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const history = await getMessages(token, connection._id);
        setChatHistory(history);
      } catch (error) {
        console.error("Failed to fetch chat history", error);
      }
    };
    fetchHistory();

    const newSocket = io('https://alumniversebackend.onrender.com', {
      auth: { token: localStorage.getItem('token') }
    });
    
    setSocket(newSocket);
    newSocket.emit('joinRoom', connection._id);

    newSocket.on('receiveMessage', (data) => {
      setChatHistory(prevHistory => [...prevHistory, data]);
      // 2. TRIGGER REFRESH: Notify MessagesPage to refresh the sidebar preview
      window.dispatchEvent(new Event("storage")); 
    });

    newSocket.on('connect_error', (err) => {
      console.error("Socket Auth Error:", err.message);
    });

    return () => newSocket.disconnect();
  }, [connection._id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      const messageData = { room: connection._id, message };
      socket.emit('sendMessage', messageData);
      setMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* 3. Header Styling: Added avatar and status for UI consistency */}
      <header className="flex items-center p-3 border-b bg-white">
        <img 
          src={recipient?.profilePicture || `https://ui-avatars.com/api/?name=${recipient?.name}&background=random`} 
          className="h-10 w-10 rounded-full object-cover mr-3 border"
          alt={recipient?.name}
        />
        <div>
          <h2 className="text-sm font-bold text-gray-800">{recipient?.name}</h2>
          <p className="text-[10px] text-green-500 font-medium">Online</p>
        </div>
      </header>
      
      <main className="flex-grow p-4 overflow-y-auto bg-gray-50">
        {chatHistory.map((chat) => {
          // 4. Robust ID Check: Handles both object and string ID formats
          const senderId = chat.sender?._id || chat.sender;
          const isSender = senderId?.toString() === currentUserId;
          
          return (
            <div key={chat._id} className={`flex ${isSender ? 'justify-end' : 'justify-start'} mb-3`}>
              <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
                isSender 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}>
                {!isSender && <p className="text-[10px] font-bold mb-1 text-blue-600">{chat.sender?.name}</p>}
                <p className="text-sm leading-relaxed">{chat.content}</p>
                <p className={`text-[9px] mt-1 text-right ${isSender ? 'text-blue-100' : 'text-gray-400'}`}>
                  {new Date(chat.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </main>
      
      <footer className="p-3 border-t bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write a message..."
            className="w-full p-2.5 bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 rounded-xl text-sm outline-none"
          />
          <button 
            type="submit" 
            disabled={!message.trim()}
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatWindow;