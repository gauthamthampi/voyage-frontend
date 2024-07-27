import React from 'react';
import PersonalDetails from './personaldetails.js';
import BookingsTrips from './bookings&trips.js'
import Rewards from "./rewards.js"
import Subcriptions from './subscription.js'
import Saved from './saved.js'


const Content = ({ selectedItem }) => {
  const contentMap = {
    'Item 1': <PersonalDetails />,
    'Item 2': <BookingsTrips />,
    'Item 3': <Rewards />,
    'Item 4': <Subcriptions />,
    'Item 5': <Saved />,
    'Item 6': <Saved />,

  };

  return (
    <div>
      {selectedItem && contentMap[selectedItem]}
    </div>
  );
};

export default Content;
