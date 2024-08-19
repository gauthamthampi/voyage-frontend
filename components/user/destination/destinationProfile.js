'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cormorant, Montserrat } from 'next/font/google';
import { localhost } from '../../../url';
import axiosInstance from '@/utils/axios';


export const zenDots = Montserrat({
    subsets: ['latin'],
    weight: '700', 
    
  });


const DestinationProfile = ({ name }) => {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const response = await axiosInstance.get(`${localhost}/destinations/${name}`);
        setDestination(response.data);
      } catch (error) {
        setError('Error fetching destination');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
  }, [name]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!destination) {
    return <div>No destination found</div>;
  }

  return (
    <div>
  <div className="relative w-full h-96 overflow-hidden">
    <img
      src={`${localhost}/uploads/${destination.coverPhoto}`}
      alt="Cover"
      className="w-full h-full object-cover object-center"
    />
    <h1 className={`uppercase text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold p-2 hover:text-black ${zenDots.className}`}>
      {destination.name}
    </h1>
  </div>
  <div className="p-6 mx-20">
    <h2 className="text-2xl font-bold mb-4">About</h2>
    <p className="mb-6">{destination.description}</p>
    <h2 className="text-2xl font-bold mb-4">Best Season</h2>
    <p className="mb-6">{destination.bestSeason}</p>
    <h2 className="text-2xl font-bold mb-4">Things to Do</h2>
    <ul className="list-disc pl-5">
      {destination.thingsToDo.map((item, index) => (
        <li key={index} className="mb-2">
          <strong>{item.place}</strong>: {item.description}
        </li>
      ))}
    </ul>
  </div>
</div>

  );
};

export default DestinationProfile;

