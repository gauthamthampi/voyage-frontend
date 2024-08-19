import React from 'react';

const SidebarProperties = ({ onItemClick }) => {
  return (
    <div className="p-4">
      <ul>
        <li 
          onClick={() => onItemClick('Item 1')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Properties
        </li>
        <li 
          onClick={() => onItemClick('Item 3')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Bookings
        </li>
        <li 
          onClick={() => onItemClick('Item 2')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Messages
        </li>
      
        <li 
          onClick={() => onItemClick('Item 4')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Dashboard
        </li>

        <li 
          onClick={() => onItemClick('Item 5')} 
          className="cursor-pointer p-4 hover:bg-gray-200"
        >
          Blogs
        </li>
      </ul>
    </div>
  );
};

export default SidebarProperties;
