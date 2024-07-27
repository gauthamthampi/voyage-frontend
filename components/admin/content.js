import React from 'react';
import Customers from './customers';
import Properties from './properties';
import Bookings from './bookings';
import Destinations from './destinations';
import Coupons from './coupons';
import Dashboard from './dashboard';
import SalesReport from './sales'

const AdminContent = ({ selectedItem }) => {
  const contentMap = {
    'Item 1': <Dashboard />,
    'Item 2': <Customers />,
    'Item 3': <Properties />,
    'Item 4': <Bookings />,
    'Item 5': <Destinations />,
    'Item 6': <Coupons />,
    'Item 7': <SalesReport />,

  };

  return (
    <div>
      {selectedItem && contentMap[selectedItem]}
    </div>
  );
};

export default AdminContent;
