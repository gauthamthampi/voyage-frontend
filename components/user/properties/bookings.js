import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getEmailFromToken from '@/utils/decode';
import { localhost } from '@/url';
import { useRouter } from 'next/navigation';
import BookingDetailsModal from './bookingconfirm';
import axiosInstance from '@/utils/axios';

const PropertyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('propertyName');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const userEmail = getEmailFromToken();
  const router = useRouter();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterAndSortBookings();
  }, [bookings, searchTerm, sortOption]);

  const fetchBookings = async () => {
    try {
      const response = await axiosInstance.get(`${localhost}/api/property/getPropertyBookingDetails`, {
        params: { userEmail }
      });
      if (response.data.success) {
        setBookings(response.data.bookings);
        setFilteredBookings(response.data.bookings); 
      } else {
        toast.error('Error fetching bookings', {
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
      console.error('Error fetching bookings:', error);
      toast.error('Error fetching bookings', {
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
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortBookings = () => {
    let filtered = bookings.filter(booking =>
      booking.propertyId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOption === 'propertyName') {
      filtered.sort((a, b) => a.propertyId.name.localeCompare(b.propertyId.name));
    } else if (sortOption === 'status') {
      const order = { 'Upcoming': 1, 'Completed': 2, 'Cancelled': 3 };
      filtered.sort((a, b) => order[a.status] - order[b.status]);
    }

    setFilteredBookings(filtered);
  };

  const handleViewDetails = async (bookingId) => {
    try {
      const bookingResponse = await axiosInstance.get(`${localhost}/api/getBookingDetails/${bookingId}`);
      const propertyResponse = await axiosInstance.get(`${localhost}/api/getPropertyDetails/${bookingResponse.data.propertyId}`);
      const roomDetails = propertyResponse.data.rooms.find(room => room._id === bookingResponse.data.room[0].roomId);
      setBookingDetails(bookingResponse.data);
      setPropertyDetails(propertyResponse.data);
      setRoomDetails(roomDetails);
      setSelectedBooking(bookingId);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast.error('Error fetching booking details', {
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

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setBookingDetails(null);
    setPropertyDetails(null);
    setRoomDetails(null);
  };

  const handleMarkAsCompleted = async (bookingId) => {
    try {
      const response = await axiosInstance.post(localhost+'/api/markBookingCompleted', { bookingId });
      if (response.data.success) {
        toast.success('Booking marked as completed', {
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
        const updatedBookings = bookings.map((booking) =>
          booking._id === bookingId ? { ...booking, status: 'Completed' } : booking
        );
        setBookings(updatedBookings);
      } else {
        toast.error('Error marking booking as completed', {
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
      console.error('Error marking booking as completed:', error);
      toast.error('Error marking booking as completed', {
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

  return (
    <div className="p-2">
      <ToastContainer />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Bookings</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="propertyName">Sort by Property Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p>Loading bookings...</p>
      ) : (
        <table className="min-w-full bg-white border p-2 border-gray-200 rounded-lg shadow-md">
          <thead>
            <tr className="border-b">
              <th className="p-3 text-left">Property Name</th>
              <th className="p-3 text-left">Customer Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Payment Status</th>
              <th className="p-3 text-left">Check-in Date</th>
              <th className="p-3 text-left">Check-out Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking._id} className="border-b">
                <td className="p-3">{booking.propertyId.name}</td>
                <td className="p-3">{booking.userName}</td>
                <td className="p-3">{booking.mobile}</td>
                <td className="p-3">{booking.payment[0].status}</td>
                <td className="p-3">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td className="p-3">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                <td className="p-3">{booking.status}</td>
                <td className="p-3 flex space-x-2">
                  <button 
                    onClick={() => handleViewDetails(booking._id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition"
                  >
                    View
                  </button>
                  {(booking.status !== 'Completed' && booking.status !== 'Cancelled') && (
    <button 
      onClick={() => handleMarkAsCompleted(booking._id)}
      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 transition"
    >
      Check Out
    </button>
  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedBooking && (
        <BookingDetailsModal
          bookingDetails={bookingDetails}
          propertyDetails={propertyDetails}
          roomDetails={roomDetails}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default PropertyBookings;
