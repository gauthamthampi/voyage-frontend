import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import getEmailFromToken from '@/utils/decode';
import { localhost } from '@/url';

function BookingsProperties() {
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const router = useRouter();
  const userEmail = getEmailFromToken();

  useEffect(() => {
    if (userEmail) {
      axios.get(`${localhost}/api/userprofile/bookings`, {
        params: {
          userEmail: userEmail,
          limit: 3
        }
      })
      .then(response => {
        setBookings(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });
    }
  }, [userEmail]);

  const handleCancelBooking = (bookingId, paymentMethod) => {
    setBookingToCancel(bookingId);
    setPaymentMethod(paymentMethod);
    setShowModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      await axios.post(`${localhost}/api/userprofile/cancelbooking/${bookingToCancel}`);
      setBookings((prevBookings) => 
        prevBookings.map((booking) => 
          booking._id === bookingToCancel ? { ...booking, status: 'Cancelled' } : booking
        )
      );
      setShowModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <button 
          className="text-blue-500 underline" 
          onClick={() => router.push('/bookinghistory')}
        >
          Show all bookings
        </button>
      </div>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div 
            key={booking._id} 
            className="flex border border-gray-300 p-4 rounded-lg relative"
          >
            <img 
              src={`${localhost}/uploads/${booking.property.photos[0]}`} 
              alt={booking.property.name} 
              className="w-32 h-32 object-cover rounded-md mr-4" 
            />
            <div className="flex-grow">
              <h3 className="text-xl font-semibold">{booking.property.name}</h3>
              <p className="text-gray-600">Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p className="text-gray-600">Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p className="text-gray-800 font-medium">Status: {booking.status}</p>
            </div>
            {booking.status === 'Upcoming' && (
              <button 
                className="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={() => handleCancelBooking(booking._id, booking.payment[0]?.method)}
              >
                Cancel Booking
              </button>
            )}
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Cancellation</h2>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="flex justify-end mt-4">
              <button 
                className="px-4 py-2 bg-gray-300 text-black rounded-lg mr-2"
                onClick={() => setShowModal(false)}
              >
                No
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                onClick={confirmCancelBooking}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Booking Cancelled</h2>
            <p>Your booking cancellation is successful.</p>
            {paymentMethod === 'Online' && (
              <p>Please check your wallet for the status of the refund.</p>
            )}
            <div className="flex justify-end mt-4">
              <button 
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsProperties;
