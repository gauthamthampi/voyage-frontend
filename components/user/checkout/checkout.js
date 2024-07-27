'use client'
import { localhost } from '@/url';
import axios from 'axios';
import { useRouter,useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [roomDetails,setRoomDetails] = useState([])
  const [hotelDetails,setHotelDetails] = useState([])
  const hotelname = searchParams.get('hotelname')
  const roomCategory = searchParams.get('roomCategory');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const travellers = searchParams.get('travellers');
  const rooms = searchParams.get('rooms');
  const roomId = searchParams.get('roomId');

  const fetchHotelDetails = async ()=>{
    const response = await axios.get(`${localhost}/api/checkout/getHotelDetails`, { params: { roomId } })
    console.log(response.data);
    setHotelDetails(response.data.hotel)
    setRoomDetails(response.data.room)
  }

  useEffect(()=>{
    fetchHotelDetails()
  },[])

  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');

  const handlePayment = () => {
    // Add payment processing logic here
    console.log('Proceed to payment with details:', { name, mobile, paymentMethod });
  };
  
  return (
    <div className="container mx-auto p-6">
     <h1 className='text-center mt-5 mb-10 text-2xl font-bold'>Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-20">
        
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">User Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full mt-2 p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Mobile:</label>
            <input 
              type="text" 
              value={mobile} 
              onChange={(e) => setMobile(e.target.value)} 
              className="w-full mt-2 p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Payment Method:</label>
            <select 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              className="w-full mt-2 p-2 border rounded-lg"
            >
              <option value="online">Online</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          <button 
            onClick={handlePayment} 
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Proceed to Payment
          </button>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
          <div className="flex justify-between">
        <p><strong>Hotel Name:</strong></p>
        <p>{}</p>
      </div>
          <div className="flex justify-between">
        <p><strong>Room Category:</strong></p>
        <p>{roomCategory}</p>
      </div>
      <div className="flex justify-between">
        <p><strong>Check-in Date:</strong></p>
        <p>{checkInDate}</p>
      </div>
      <div className="flex justify-between">
        <p><strong>Check-out Date:</strong></p>
        <p>{checkOutDate}</p>
      </div>
      <div className="flex justify-between">
        <p><strong>Number of Travellers:</strong></p>
        <p>{travellers}</p>
      </div>
      <div className="flex justify-between">
        <p><strong>Number of Rooms:</strong></p>
        <p>{rooms}</p>
      </div>
          <div className="my-4 border-t border-gray-300"></div>
          <div>
            <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
            <div className="flex justify-between">
          <p><strong>Subtotal:</strong></p>
          <p>₹{roomDetails.price}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Tax:</strong></p>
          <p>₹100</p>
        </div>
            <div className="my-4 border-t border-gray-300"></div>

            <div className="flex justify-between">
          <p><strong>Total To Pay:</strong></p>
          <p className='font-bold'>₹{roomDetails.price+100}</p>
        </div>
          </div>        
        </div>
      </div>
    </div>
  );
};

export default Checkout;
