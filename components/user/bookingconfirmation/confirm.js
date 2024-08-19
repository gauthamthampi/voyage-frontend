'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../../utils/axios';
import { localhost } from '../../../url';
import { useRouter } from 'next/navigation';
import { IoCheckmarkDoneCircle } from "react-icons/io5";

const BookingConfirmation = ({ bookingId }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [couponDetails, setCouponDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (bookingId) {
      const fetchBookingDetails = async () => {
        try {
          const bookingResponse = await axiosInstance.get(`${localhost}/api/getBookingDetails/${bookingId}`);
          const propertyResponse = await axiosInstance.get(`${localhost}/api/getPropertyDetails/${bookingResponse.data.propertyId}`);
          const roomDetails = propertyResponse.data.rooms.find(room => room._id === bookingResponse.data.room[0].roomId);

          setBookingDetails(bookingResponse.data);
          setPropertyDetails(propertyResponse.data);
          setRoomDetails(roomDetails);

          if (bookingResponse.data.coupon) {
            // Fetch coupon details
            const couponResponse = await axiosInstance.get(`${localhost}/api/getCouponDetails/${bookingResponse.data.coupon.id}`);
            setCouponDetails(couponResponse.data);
            console.log(couponResponse.data,"coup");
            
          }

          setLoading(false);
        } catch (err) {
          console.error('Error fetching booking details:', err);
          setError('Failed to load booking details');
          setLoading(false);
        }
      };

      fetchBookingDetails();
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div role="status" className="flex flex-col items-center">
          {/* Loading spinner */}
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const discount = couponDetails ? couponDetails.discountValue : 0;
  const totalAmount = roomDetails ? roomDetails.price * bookingDetails.room[0].quantity : 0;
  const discountAmount = (totalAmount * discount) / 100;
  const finalAmount = bookingDetails ? bookingDetails.payment[0].amountPaid : totalAmount - discountAmount;

  return bookingDetails && (
    <div className="container p-6 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-blue-600 text-white text-center py-4 px-6 rounded-t-md shadow-md mx-4">
        <IoCheckmarkDoneCircle className="mx-auto mb-2 text-6xl" />
        <h2 className="text-2xl font-bold mb-2">Booking Successful!</h2>
        <p className="mb-4">Congratulations, Your booking for this package is done.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div className="bg-white shadow-md rounded-lg p-4">
          <p className="text-lg font-bold mb-2">Booking Information</p>
          <p className="font-semibold">Booking ID: {bookingDetails.bookingId}</p>
          <p>Booked On: {new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
          <p>No of Travellers: {bookingDetails.travellers}</p>
          <p>Check-In Date: {new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
          <p>Check-Out Date: {new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
          <p>Room : {roomDetails.category} x {bookingDetails.room[0].quantity}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <h3 className="text-lg font-bold mb-2">Customer Details</h3>
          <p>Name: {bookingDetails.userName}</p>
          <p>Email: {bookingDetails.userEmail}</p>
          <p>Phone: {bookingDetails.mobile}</p>
        </div>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Billing Details</h3>
            <div className="flex justify-between items-center">
              <p>Total Amount</p>
              <p>₹ {totalAmount}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Tax</p>
              <p>₹ 100</p>
            </div>
            {discount > 0 && (
              <>
                <div className="flex justify-between items-center">
                  <p>Discount ({discount}%)</p>
                  <p>₹ {discountAmount.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-bold">Grand Total</p>
                  <p className="font-bold">₹ {finalAmount.toFixed(2)}</p>
                </div>
              </>
            )}
            {!discount && (
              <div className="flex justify-between items-center">
                <p className="font-bold">Grand Total</p>
                <p className="font-bold">₹ {bookingDetails.payment[0].amountPaid}</p>
              </div>
            )}
          </div>
          <div className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold mb-2">Property Details</h3>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-64 h-48 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                <img src={`${localhost}/uploads/${propertyDetails.photos[0]}`} alt="Property" className="object-cover w-full h-full" />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <p>Name: {propertyDetails.name}</p>
                  <p><a href={`mailto:${bookingDetails.ownerMailId}`}>{bookingDetails.ownerMailId}</a></p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p>Owner: {propertyDetails.email}</p>
                  <p><a href={`mailto:${bookingDetails.ownerMailId}`}>{bookingDetails.ownerMailId}</a></p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p>Address: {propertyDetails.destination}</p>
                  <p></p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p>Phone:</p>
                  <p>{bookingDetails.ownerPhone}</p>
                </div>
                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => router.push(`/chat/${propertyDetails.email}`)}
                >
                  Chat with property owner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center p-4">
        <p className="text-gray-700">Thank you for choosing <strong>VOYAGE</strong></p>
        <div className="mt-4 space-x-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => router.push('/')}
          >
            Return to Home
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => router.push('/bookinghistory')}
          >
            Order History
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
