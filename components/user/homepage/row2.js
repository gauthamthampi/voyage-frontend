import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Encode_Sans,Montserrat } from 'next/font/google';
import { localhost } from '@/url';
import axiosInstance from '@/utils/axios';

export const encode_sans = Encode_Sans({
    subsets: ['latin'],
    weight: '200', 
  });

  export const zenDots = Montserrat({
    subsets: ['latin'],
    weight: '400', 
  });

const PropertySugg = () => {
  const [properties, setProperties] = useState([]);
  const router = useRouter()

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axiosInstance.get(localhost + '/api/getAllProperties');
        const data = response.data;
        console.log(data+"data");
        if (Array.isArray(data)) {
            setProperties(data.slice(0, 4)); 
          } else {
            console.error('Invalid data structure:', data);
          }      
        } catch (error) {
        console.error('Error fetching trending destinations:', error);
      }
    };

    fetchDestinations();
  }, []);
   
  const handleDestinationClick = (id) => {
    router.push(`/hotel/${id}`);
  };

  const handleSeeAllClick = () => {
    router.push('/explore');
  };

  return (
    <div className="py-8">
    <div className="flex justify-between items-center mx-20 my-8">
      <h2 className={`text-2xl font-thin ${encode_sans.className}`}>PROPERTIES YOU MAY LIKE</h2>
      <button 
        onClick={handleSeeAllClick} 
        className="text-blue-500 hover:underline"
      >
        See All
      </button>
    </div>
    <div className="flex mx-20 gap-20">
      {properties.map((property, index) => (
        <div 
          key={index} 
          className="text-center transition-transform transform hover:scale-105 cursor-pointer"
          onClick={() => handleDestinationClick(property._id)}
        >
          <img
            src={`${localhost}/uploads/${property.photos[0]}`}
            alt={property.name}
            className="rounded-lg w-64 h-40 object-cover"
          />
          <p className={`mt-2 text-lg font-semibold ${zenDots.className}`}>{property.name}</p>
        </div>
      ))}
    </div>
  </div>

  );
};

export default PropertySugg;