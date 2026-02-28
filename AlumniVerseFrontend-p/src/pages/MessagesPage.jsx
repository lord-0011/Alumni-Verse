import React, { useState, useEffect } from 'react';
import { getConversations } from '../api';
import ChatWindow from '../components/ChatWindow';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('userId');

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getConversations(token);
      
      if (Array.isArray(data)) {
        // Sort: Newest activity at the top
        const sortedData = data.sort((a, b) => {
          const dateA = new Date(a?.lastMessage?.createdAt || a?.updatedAt || 0);
          const dateB = new Date(b?.lastMessage?.createdAt || b?.updatedAt || 0);
          return dateB - dateA;
        });
        setConversations(sortedData);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    
    // Auto-refresh sidebar when a new message is sent/received in ChatWindow
    window.addEventListener('message-update', fetchConversations);
    return () => window.removeEventListener('message-update', fetchConversations);
  }, []);

  const getAvatar = (user) => {
    if (!user) return `https://ui-avatars.com/api/?name=User&background=random`;
    return user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random&color=fff`;
  };

  if (loading) return <div className="mt-12 text-center text-gray-500">Loading conversations...</div>;

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white rounded-lg shadow-md mt-12 overflow-hidden mx-4 border border-gray-200">
      {/* Sidebar */}
      <div className="w-1/3 border-r flex flex-col bg-gray-50">
        <header className="p-4 border-b bg-white">
          <h1 className="text-lg font-bold text-gray-800">Conversations</h1>
        </header>
        <div className="flex-grow overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-6 text-gray-500 text-center text-sm">No conversations found.</p>
          ) : (
            conversations.map(conv => {
              // SECURITY GUARD: Prevent "undefined" crashes
              if (!conv) return null;

              // Identify the other participant safely using optional chaining
              const otherUser = 
                conv.student?._id === currentUserId ? conv.alumni :
                conv.alumni?._id === currentUserId ? conv.student :
                conv.requester?._id === currentUserId ? conv.recipient :
                conv.recipient?._id === currentUserId ? conv.requester : 
                null;

              if (!otherUser) return null;

              // Extract last message content (checks multiple possible field names)
              const lastMsg = conv.lastMessage;
              const lastMsgText = lastMsg?.content || lastMsg?.message || lastMsg?.text; 
              
              const senderId = lastMsg?.sender?._id || lastMsg?.sender;
              const isLastMsgFromMe = senderId === currentUserId;

              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-3 cursor-pointer hover:bg-white transition-colors border-b flex items-center space-x-3 ${activeConversation?._id === conv._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'bg-transparent'}`}
                >
                  <img 
                    src={getAvatar(otherUser)} 
                    alt={otherUser.name || 'User'} 
                    className="h-10 w-10 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className="font-bold text-gray-800 truncate text-sm">{otherUser.name || 'User'}</p>
                      {lastMsg?.createdAt && (
                        <span className="text-[10px] text-gray-400 ml-2">
                          {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-xs truncate mt-0.5 ${activeConversation?._id === conv._id ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                      {lastMsgText ? (
                        <>
                          {isLastMsgFromMe && <span>You: </span>}
                          {lastMsgText}
                        </>
                      ) : (
                        <span className="italic text-gray-400">No messages yet</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col bg-gray-100">
        {activeConversation ? (
          <ChatWindow connection={activeConversation} key={activeConversation._id} />
        ) : (
          <>
            <header className="p-4 border-b bg-white invisible">
              <h1 className="text-lg font-bold">&nbsp;</h1>
            </header>
            <div className="flex flex-col items-center justify-center flex-grow text-gray-500 space-y-2">
              <p className="text-lg font-medium">Your Messages</p>
              <p className="text-xs">Select a conversation to view your history.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;