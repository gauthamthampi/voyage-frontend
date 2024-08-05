import { localhost } from '@/url';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import getEmailFromToken from '@/utils/decode';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const userEmail = getEmailFromToken();

  const fetchBookingHistory = async () => {
    try {
      const response = await axios.get(`${localhost}/api/getUserBookings`, {
        params: { userEmail }
      });
      if (response.data.success) {
        setBookings(response.data.bookings);
        console.log("response" + response.data.bookings);
      } else {
        toast.error('Error fetching booking history', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Error fetching booking history:', error);
      toast.error('Error fetching booking history', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      const response = await axios.post(`${localhost}/api/cancelBooking`, { bookingId });
      if (response.data.success) {
        toast.success('Booking canceled successfully', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        fetchBookingHistory(); // Refresh the booking history
      } else {
        toast.error('Error canceling booking', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error('Error canceling booking:', error);
      toast.error('Error canceling booking', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <ToastContainer />
      <h1 className="text-center mt-5 mb-10 text-3xl font-bold">Booking History</h1>
      {bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={`${localhost}/uploads/${booking.propertyId.photos[0]}`} // Assuming property photo URL is available
                alt={booking.propertyId.name}
                className="w-full h-64 object-cover rounded-t-lg"
                onError={(e) => e.target.src = 'default-image-path.jpg'} // Fallback image
              />
              <div className="p-6 flex flex-col md:flex-row">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 text-blue-700">{booking.propertyId.name}</h3>
                  <p className="text-gray-700 mb-2"><strong>Check-in Date:</strong> {new Date(booking.checkInDate).toLocaleDateString('en-GB')}</p>
                  <p className="text-gray-700 mb-2"><strong>Check-out Date:</strong> {new Date(booking.checkOutDate).toLocaleDateString('en-GB')}</p>
                  <p className="text-gray-700 mb-2"><strong>No of days:</strong> {booking.noofdays}</p>
                  <p className="text-gray-700 mb-2"><strong>Number of Travellers:</strong> {booking.travellers}</p>
                </div>
                <div className="border-l border-gray-300 mx-4"></div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Number of Rooms:</strong> {booking.room.map(room => room.quantity).join(', ')}</p>
                    <p className="text-gray-700 mb-2"><strong>Total Amount Paid:</strong> ₹{booking.payment[0].amountPaid}</p>
                    <p className="text-gray-700 mb-2"><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString('en-GB')}</p>
                    <p className="text-gray-700 mb-2"><strong> Payment Status:</strong>
                      <span className={booking.payment[0].status === 'Paid' ? 'text-green-600 p-1                   ' : ''}>{booking.payment[0].status}</span>
                    </p>

                  </div>
                  <button
                   onClick={() => handleCancelBooking(booking._id)}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded w-48 hover:bg-red-700 transition duration-300"
                  >
                  Cancel Booking
                  </button>

                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.p 
          className="text-center text-xl text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No bookings found
        </motion.p>
      )}
    </div>
  );
};

export default BookingHistory;
