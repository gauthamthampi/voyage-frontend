import React from 'react';
import { IoCheckmarkDoneCircle } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const AdminBookingDetailsModal = ({ bookingDetails, roomDetails, onClose }) => {
  const router = useRouter();


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full overflow-y-auto max-h-screen relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          Close
        </button>
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-blue-600 text-white text-center py-4 px-6 mt-5 rounded-t-md shadow-md">
            <IoCheckmarkDoneCircle className="mx-auto mb-2 text-6xl" />
            <h2 className="text-2xl font-bold mb-2">Booking Successful!</h2>
          </div>
          
          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            {/* Booking Information */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Booking Information</h3>
              <div className="flex justify-between mb-2">
                <p className="font-semibold">Booking ID:</p>
                <p>{bookingDetails.bookingId}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Booked On:</p>
                <p>{new Date(bookingDetails.bookingDate).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>No of Travellers:</p>
                <p>{bookingDetails.travellers}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Check-In Date:</p>
                <p>{new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Check-Out Date:</p>
                <p>{new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Room:</p>
                <p>{roomDetails.category} x {bookingDetails.room[0].quantity}</p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Customer Details</h3>
              <div className="flex justify-between mb-2">
                <p>Name:</p>
                <p>{bookingDetails.userName}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Email:</p>
                <p>{bookingDetails.userEmail}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Phone:</p>
                <p>{bookingDetails.mobile}</p>
              </div>
            </div>

            {/* Billing Details */}
            <div className="bg-white shadow-md rounded-lg p-6 md:col-span-2">
              <h3 className="text-lg font-bold mb-4">Billing Details</h3>
              <div className="flex justify-between mb-2">
                <p>Total Amount:</p>
                <p>₹ {roomDetails.price * bookingDetails.room[0].quantity}</p>
              </div>
              <div className="flex justify-between mb-2">
                <p>Discount:</p>
                <p>₹ 100</p>
              </div>
              <div className="flex justify-between mb-2">
                <p className="font-bold">Grand Total:</p>
                <p className="font-bold">₹ {bookingDetails.payment[0].amountPaid}</p>
              </div>
            </div>
          </div>
          
          {/* Chat with Customer Button */}
          
        </div>
      </div>
    </div>
  );
};

export default AdminBookingDetailsModal;
