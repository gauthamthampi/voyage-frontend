import React from 'react';

const SidebarProfile = ({ onItemClick }) => {
  return (
    <div className="p-4">
      <ul>
        <li 
          onClick={() => onItemClick('Item 1')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Personal Details
        </li>
        <li 
          onClick={() => onItemClick('Item 2')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Bookings and Trips
        </li>
        <li 
          onClick={() => onItemClick('Item 3')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Rewards 
        </li>
        <li 
          onClick={() => onItemClick('Item 4')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Subscription
        </li>
        <li 
          onClick={() => onItemClick('Item 5')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Saved
        </li>
        <li 
          onClick={() => onItemClick('Item 1')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Properties
        </li>
        {/* Add more list items for other items */}
      </ul>
    </div>
  );
};

export default SidebarProfile;
