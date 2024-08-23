"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { localhost } from '../../../url';
import getEmailFromToken from '../../../utils/decode';
import axiosInstance from '@/utils/axios';

const Rewards = () => {
  const [coupons, setCoupons] = useState([]);
  const userEmail = getEmailFromToken();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axiosInstance.get(`${localhost}/api/user/coupons`, {
          params: { email: userEmail }
        });
        setCoupons(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error('Error fetching user coupons:', error);
      }
    };

    fetchCoupons();
  }, [userEmail]);

  return (
    <div>
      <p className='p-6 text-lg font-bold'>Rewards</p>
      <div className='grid grid-cols-3 gap-4 mx-3 '>
      {coupons.map((coupon, index) => (
  <div
    key={index}
    className={`p-4 rounded shadow hover:shadow-lg transition-shadow duration-300 ${coupon.isActive ? 'bg-white' : 'bg-gray-300 opacity-50 relative'} border`}
  >
    {!coupon.isActive && (
      <div className='absolute inset-0 flex items-center justify-center'>
        {/* Background box for the "Expired" text */}
        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">Expired</div>
      </div>
    )}
    <h2 className='font-semibold text-xl'>{coupon.code}</h2>
    <p className='text-gray-600'>{coupon.description}</p>
    <p className={`mt-4 font-bold ${coupon.quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
      {coupon.quantity > 0 ? `${coupon.quantity} coupons left` : '0 coupons left'}
    </p>
  </div>
))}



      </div>
    </div>
  );
};

export default Rewards;
