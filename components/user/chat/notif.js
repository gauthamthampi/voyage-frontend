
import React from 'react';

const Notification = ({ notifications, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center justify-between"
        >
          <div className="flex items-center">
            <img
              src={notification.profilePic || '/images/defaultdp.jpg'}
              alt="Profile"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div>
              <div className="font-bold">{notification.senderEmail}</div>
              <div>{notification.message}</div>
            </div>
          </div>
          <button
            onClick={() => onClose(index)}
            className="ml-4 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-full"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
