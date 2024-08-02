import { localhost } from '@/url';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <h1 className="text-center mt-5 mb-10 text-3xl font-bold text-blue-600">Booking History</h1>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <img
                src={`${localhost}/uploads/${booking.propertyId.photos[0]}`} // Assuming property photo URL is available
                alt={booking.propertyId.name}
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => e.target.src = 'default-image-path.jpg'} // Fallback image
              />
              <div className="p-4">
                <h3 className="text-xl font-bold mb-2 text-blue-700">{booking.propertyId.name}</h3>
                <p className="text-gray-600"><strong>Check-in Date:</strong> {new Date(booking.checkInDate).toLocaleDateString('en-GB')}</p>
                <p className="text-gray-600"><strong>Check-out Date:</strong> {new Date(booking.checkOutDate).toLocaleDateString('en-GB')}</p>
                <p className="text-gray-600"><strong>No of days:</strong> {booking.noofdays}</p>
                <p className="text-gray-600"><strong>Number of Travellers:</strong> {booking.travellers}</p>
                <p className="text-gray-600"><strong>Number of Rooms:</strong> {booking.room.map(room => room.quantity).join(', ')}</p>
                <p className="text-gray-600"><strong>Total Amount Paid:</strong> ₹{booking.amount}</p>
                <p className="text-gray-600"><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString('en-GB')}</p>
                <p className={`text-lg font-bold ${booking.payment[0].status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                  <strong>Payment Status:</strong> {booking.payment[0].status}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500">No bookings found</p>
      )}
    </div>
  );
};

export default BookingHistory;
