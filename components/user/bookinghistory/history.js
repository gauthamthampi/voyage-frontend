import { localhost } from '@/url';
import axios from 'axios';
import axiosInstance from '../../../utils/axios';
import { useEffect, useState } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import getEmailFromToken from '@/utils/decode';
import Rating from 'react-rating-stars-component';


const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [bookingToRate, setBookingToRate] = useState(null);
  const [rating, setRating] = useState({ location: 0, cleanliness: 0, facilities: 0, service: 0 });
  const [review, setReview] = useState('');
  const userEmail = getEmailFromToken();

  const fetchBookingHistory = async () => {
    try {
      const response = await axiosInstance.get(`${localhost}/api/getUserBookings`, {
        params: { userEmail }
      });
      if (response.data.success) {
        setBookings(response.data.bookings);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const filteredBookings = bookings
    .filter((booking) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.propertyId.name.toLowerCase().includes(searchLower) ||
        booking.checkInDate.toLowerCase().includes(searchLower) ||
        booking.checkOutDate.toLowerCase().includes(searchLower)
      );
    })
    .filter((booking) => selectedStatus === 'All' || booking.status === selectedStatus);

  const handleCancelBooking = (bookingId) => {
    setBookingToCancel(bookingId);
    setShowModal(true);
  };

  const confirmCancelBooking = async () => {
    try {
      const response = await axiosInstance.post(`${localhost}/api/cancelBooking`, { bookingId: bookingToCancel });
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
      setShowModal(false);
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

  const handleRatingChange = (category, value) => {
    setRating((prevRating) => ({ ...prevRating, [category]: value }));
  };

  const handleSubmitRating = async () => {
    const selectedBooking = bookings.find(booking => booking._id === bookingToRate);
    try {
      const response = await axiosInstance.post(`${localhost}/api/submitRating`, {
        userEmail,
        bookingId: bookingToRate,
        propertyId: selectedBooking.propertyId,
        rating,
        review,
      });
      if (response.data.success) {
        toast.success('Rating submitted successfully', {
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
        fetchBookingHistory(); 
      } else {
        toast.error('Error submitting rating', {
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
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Error submitting rating', {
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
      <div className="flex justify-between mb-4">
        <input 
          type="text" 
          placeholder="Search bookings..." 
          value={searchTerm}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg p-2 w-full max-w-md"
        />
        <div className="flex space-x-4">
          <select 
            value={selectedStatus}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-lg p-2"
          >
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      {filteredBookings.length > 0 ? (
        <div className="space-y-6">
          {filteredBookings.map((booking, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                src={`${localhost}/uploads/${booking.propertyId.photos[0]}`}
                alt={booking.propertyId.name}
                className="w-full h-64 object-cover rounded-t-lg"
                onError={(e) => e.target.src = 'default-image-path.jpg'}
              />
              <div className="p-6 flex flex-col md:flex-row">
                <div className="flex-1">
                  <h3 className={`text-2xl font-bold mb-3 ${booking.status === 'Upcoming' ? 'text-blue-700' : booking.status === 'Cancelled' ? 'text-red-700' : 'text-green-700'}`}>{booking.propertyId.name}</h3>
                  <p className="text-gray-700 mb-2"><strong>Check-in Date:</strong> {new Date(booking.checkInDate).toLocaleDateString('en-GB')}</p>
                  <p className="text-gray-700 mb-2"><strong>Check-out Date:</strong> {new Date(booking.checkOutDate).toLocaleDateString('en-GB')}</p>
                  <p className="text-gray-700 mb-2"><strong>No of days:</strong> {booking.noofdays}</p>
                  <p className="text-gray-700 mb-2"><strong>Number of Travellers:</strong> {booking.travellers}</p>
                  <p className="text-gray-700 mb-2"><strong>Booking Status:</strong> {booking.status}</p>
                  
                </div>
                <div className="border-l border-gray-300 mx-4"></div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-gray-700 mb-2"><strong>Number of Rooms:</strong> {booking.room.map(room => room.quantity).join(', ')}</p>
                    <p className="text-gray-700 mb-2"><strong>Total Amount Paid:</strong> ₹{booking.payment[0].amountPaid}</p>
                    <p className="text-gray-700 mb-2"><strong>Booking Date:</strong> {new Date(booking.bookingDate).toLocaleDateString('en-GB')}</p>
                    <p className="text-gray-700 mb-2"><strong> Payment Status:</strong>
                      <span className={booking.payment[0].status === 'Paid' ? 'text-green-600' : ''}>{booking.payment[0].status}</span>
                    </p>
                  </div>
                  {booking.status === 'Upcoming' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="mt-4 bg-red-500 text-white py-2 px-4 rounded w-48 hover:bg-red-700 transition duration-300"
                    >
                      Cancel Booking
                    </button>
                  )}
                  {booking.status === 'Completed' && !booking.ratingSubmission && (
                    <button
                      onClick={() => { setBookingToRate(booking._id); setShowRatingModal(true); }}
                      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded w-48 hover:bg-blue-700 transition duration-300"
                    >
                      Submit Rating
                    </button>
                  )}
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Cancellation</h3>
            <p>Are you sure you want to cancel this booking?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button 
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button 
                onClick={confirmCancelBooking}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {showRatingModal && (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
       <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm mx-4">
         <h3 className="text-lg font-bold mb-4">Submit Rating</h3>
         <div>
           <label className="block mb-2">
             Location:
             <Rating
               count={5}
               value={rating.location}
               onChange={(newRating) => handleRatingChange('location', newRating)}
               size={24}
               activeColor="#ffd700"
             />
           </label>
           <label className="block mb-2">
             Cleanliness:
             <Rating
               count={5}
               value={rating.cleanliness}
               onChange={(newRating) => handleRatingChange('cleanliness', newRating)}
               size={24}
               activeColor="#ffd700"
             />
           </label>
           <label className="block mb-2">
             Facilities:
             <Rating
               count={5}
               value={rating.facilities}
               onChange={(newRating) => handleRatingChange('facilities', newRating)}
               size={24}
               activeColor="#ffd700"
             />
           </label>
           <label className="block mb-2">
             Service:
             <Rating
               count={5}
               value={rating.service}
               onChange={(newRating) => handleRatingChange('service', newRating)}
               size={24}
               activeColor="#ffd700"
             />
           </label>
           <label className="block mb-2">
             Review:
             <textarea
               value={review}
               onChange={(e) => setReview(e.target.value)}
               className="border border-gray-300 rounded-lg p-2 w-full"
               placeholder="Write your review..."
             />
           </label>
           <div className="mt-4 flex justify-end space-x-4">
             <button 
               onClick={() => setShowRatingModal(false)}
               className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
             >
               Cancel
             </button>
             <button 
               onClick={handleSubmitRating}
               className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
             >
               Submit
             </button>
           </div>
         </div>
       </div>
     </div>
      )}
    </div>
  );
};

export default BookingHistory;
