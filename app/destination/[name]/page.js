'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation'; // Corrected hook
import Navbar from '../../../components/user/navbar';
import DestinationProfile from '../../../components/user/destination/destinationProfile';
import { useParams } from 'next/navigation';

const DestinationProfilePage = () => {
  const params = useParams()
  const {name} = params
  return (
    
    <div>
      <Navbar />
      {name ? <DestinationProfile name={name} /> : <p>Loading...</p>}
    </div>
  );
};

export default DestinationProfilePage;
