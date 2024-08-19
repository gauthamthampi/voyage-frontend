import React from 'react';
import MyProperties from './myproperties';
import InboxProperties from './inbox';
import Dashboard from './dashbaord';
import BookingsProperties from './bookings';
import Blogs from './blogs'



const ContentProperties = ({ selectedItem }) => {
  const contentMap = {
    'Item 1': <MyProperties/>,
    'Item 2': <InboxProperties />,
    'Item 3': <BookingsProperties />,
    'Item 4': <Dashboard />,
    'Item 5': <Blogs />
  };

  return (
    <div>
      {selectedItem && contentMap[selectedItem]}
    </div>
  );
};

export default ContentProperties;
