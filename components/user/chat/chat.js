'use client'
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useParams, useRouter } from 'next/navigation';
import getEmailFromToken from '@/utils/decode';

const ChatPage = () => {
  const params = useParams();
  const receiverEmail = decodeURIComponent(params.email);
  const senderEmail = getEmailFromToken(); // Assuming this function returns the logged-in user's email
  const router = useRouter(); // Use router for navigation

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [sidebarChats, setSidebarChats] = useState([]); // New state for sidebar chats
  const [receiverDetails, setReceiverDetails] = useState({}); // New state for receiver details
  const [userStatus, setUserStatus] = useState('Offline'); // Status for header

  useEffect(() => {
    if (senderEmail) {
      const socketInstance = io('http://localhost:3001', {
        query: { email: senderEmail } 
      });
      setSocket(socketInstance);

      socketInstance.emit('userOnline', senderEmail);

      socketInstance.emit('getPreviousChats', senderEmail);

      socketInstance.on('previousChats', (chats) => {
        setSidebarChats(chats);
      });

      socketInstance.on('updateUserStatus', ({ email, online }) => {
        if (email === receiverEmail) {
          setUserStatus(online ? 'Online' : `Last seen: ${new Date().toLocaleTimeString()}`);
        }
      });

      return () => {
        socketInstance.emit('userOffline', senderEmail); 
        socketInstance.disconnect();
      };
    }
  }, [senderEmail]);

  useEffect(() => {
    if (receiverEmail && senderEmail) {
      const socketInstance = io('http://localhost:3001');
      setSocket(socketInstance);

      const room = [senderEmail, receiverEmail].sort().join('-');
      socketInstance.emit('joinRoom', room);

      socketInstance.on('message', (message) => {
        console.log('Message received:', message); 
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socketInstance.on('previousMessages', (previousMessages) => {
        setMessages(previousMessages);
      });

      socketInstance.emit('getUserDetails', receiverEmail);
      socketInstance.on('userDetails', (details) => {
        setReceiverDetails(details);
        setUserStatus(details.online ? 'Online' : `Last seen: ${new Date(details.lastSeen).toLocaleTimeString()}`);
      });

      socketInstance.emit('markMessagesAsRead', { senderEmail, receiverEmail });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [receiverEmail, senderEmail]);

  const sendMessage = () => {
    if (socket && senderEmail && receiverEmail) {
      console.log('Emitting message:', { senderEmail, receiverEmail, message }); // Log before emitting
      const room = [senderEmail, receiverEmail].sort().join('-');
      socket.emit('chatMessage', { room, senderEmail, message });
      setMessage('');
    }
  };

  const openChat = (email) => {
    router.push(`/chat/${encodeURIComponent(email)}`);
    socket.emit('getPreviousChats', senderEmail); // Refresh previous chats
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for previous chats */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Chats</h2>
        <ul>
          {sidebarChats.map((chat, index) => (
            <li key={index} className="mb-2 relative">
              <a onClick={() => openChat(chat.email)} className="flex items-center space-x-2 cursor-pointer">
                <img
                  src={chat.profilePic || '/images/defaultdp.jpg'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-semibold">{chat.name}</div>
                  <div className="text-sm text-gray-600 truncate">{chat.lastMessage}</div>
                </div>
              </a>
              {chat.newMessageCount > 0 && (
                <span className="absolute top-0 right-0 mt-2 mr-4 inline-block w-6 h-6 text-center bg-green-500 text-white rounded-full">
                  {chat.newMessageCount}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header with user details */}
        <div className="bg-blue-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={receiverDetails.profilePic || '/images/defaultdp.jpg'}
              alt="Profile"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h1 className="text-xl font-bold">{receiverDetails.name || 'User'}</h1>
              <div className="text-sm">{receiverEmail}</div>
            </div>
          </div>
          <div className="text-sm">{userStatus}</div> {/* Display the activity status */}
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-auto p-4 bg-gray-100">
          <div className="flex flex-col space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-start ${msg.sender === senderEmail ? 'justify-end' : 'justify-start'}`}>
                {msg.sender !== senderEmail && (
                  <img
                    src={msg.profilePic || '/images/defaultdp.jpg'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full m-2"
                  />
                )}
                <div className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === senderEmail ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 text-black self-start'
                }`}>
                  <div>{msg.text}</div>
                </div>
                {msg.sender === senderEmail && (
                  <img
                    src={msg.profilePic || '/images/defaultdp.jpg'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full m-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 border-t">
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-grow p-2 border rounded-l-md"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
