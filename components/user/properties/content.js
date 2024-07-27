import React from 'react';
import MyProperties from './myproperties';
import InboxProperties from './inbox';
import Reviews from './reviews';
import BookingsProperties from './bookings';



const ContentProperties = ({ selectedItem }) => {
  const contentMap = {
    'Item 1': <MyProperties/>,
    'Item 2': <InboxProperties />,
    'Item 3': <BookingsProperties />,
    'Item 4': <Reviews />,
  };

  return (
    <div>
      {selectedItem && contentMap[selectedItem]}
    </div>
  );
};

export default ContentProperties;
