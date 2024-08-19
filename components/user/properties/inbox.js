import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';
import getEmailFromToken from '@/utils/decode';

const Inbox = () => {
  const [socket, setSocket] = useState(null);
  const [sidebarChats, setSidebarChats] = useState([]);
  const senderEmail = getEmailFromToken();
  const router = useRouter();

  useEffect(() => {
    if (senderEmail) {
      const socketInstance = io('http://localhost:3001', {
        query: { email: senderEmail },
      });
      setSocket(socketInstance);

      socketInstance.emit('getPreviousChats', senderEmail);

      socketInstance.on('previousChats', (chats) => {
        setSidebarChats(chats);
      });

      return () => {
        socketInstance.disconnect();
      };
    }
  }, [senderEmail]);

  const openChat = (email) => {
    router.push(`/chat/${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-1/4 bg-gray-100 p-4 border-r h-screen">
      <h2 className="text-lg font-bold mb-4">Chats</h2>
      <ul>
        {sidebarChats.map((chat, index) => (
          <li key={index} className="mb-2 relative">
            <a
              onClick={() => openChat(chat.email)}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <img
                src={chat.profilePic || '/images/defaultdp.jpg'}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-semibold">{chat.name}</div>
                <div className="text-sm text-gray-600 truncate">
                  {chat.lastMessage}
                </div>
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
  );
};

export default Inbox;
