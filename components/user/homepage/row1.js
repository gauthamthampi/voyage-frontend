import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Encode_Sans,Montserrat } from 'next/font/google';
import { localhost } from '@/url';

export const encode_sans = Encode_Sans({
    subsets: ['latin'],
    weight: '200', 
  });

  export const zenDots = Montserrat({
    subsets: ['latin'],
    weight: '400', 
  });

const TrendingDestinations = () => {
  const [destinations, setDestinations] = useState([]);
  const router = useRouter()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(localhost+'/api/getUserDestinations');
        const data = response.data;
        console.log(data+"data");
        if (Array.isArray(data)) {
            setDestinations(data.slice(0, 4)); // Limit to 4 destinations
          } else {
            console.error('Invalid data structure:', data);
          }      
        } catch (error) {
        console.error('Error fetching trending destinations:', error);
      }
    };

    fetchDestinations();
  }, []);
   
  const handleDestinationClick = (name) => {
    router.push(`/destination/${name}`);
  };

  const handleSeeAllClick = () => {
    router.push('/exploredestination');
  };

  return (
    <div className="py-8">
    <div className="flex justify-between items-center mx-20 my-8">
      <h2 className={`text-2xl font-thin ${encode_sans.className}`}>TRENDING DESTINATIONS</h2>
      <button 
        onClick={handleSeeAllClick} 
        className="text-blue-500 hover:underline"
      >
        See All
      </button>
    </div>
    <div className="flex mx-20 gap-20">
      {destinations.map((destination, index) => (
        <div 
          key={index} 
          className="text-center transition-transform transform hover:scale-105 cursor-pointer"
          onClick={() => handleDestinationClick(destination.name)}
        >
          <img
            src={`${localhost}/uploads/${destination.coverPhoto}`}
            alt={destination.name}
            className="rounded-lg w-64 h-40 object-cover"
          />
          <p className={`mt-2 text-lg font-semibold ${zenDots.className}`}>{destination.name}</p>
        </div>
      ))}
    </div>
  </div>

  );
};

export default TrendingDestinations;