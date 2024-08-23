'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Modal from 'react-modal';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from 'axios';
import { localhost } from '@/url';
import getEmailFromToken from '@/utils/decode';
import { FaHeart } from 'react-icons/fa';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useRouter} from "next/navigation"
import { Avatar } from '@material-tailwind/react';
import GoogleMapViewModal from './gmap';
import axiosInstance from '@/utils/axios';
import Rating from 'react-rating-stars-component';
import { useAuthStore } from '@/store/store';




const HotelDetail = ({ id }) => {
  const [surrCategories, setsurrCategories] = useState({
    'Things nearby': [],
    "Cafe's and Restaurants": [],
    'Transportation': []
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ownerBookingModalIsOpen, setOwnerBookingModalIsOpen] = useState(false);
  const [availabilityModalIsOpen, setAvailabilityModalIsOpen] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [propertyDetails, setPropertyDetails] = useState({});
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedRoomCategory, setSelectedRoomCategory] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [travellers, setTravelers] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const userEmail = getEmailFromToken();
  const [isRoomAvailable, setIsRoomAvailable] = useState(false);
  const router = useRouter()
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [averageRatings, setAverageRatings] = useState(null);
  const setCheckoutDetails = useAuthStore((state) => state.setCheckoutDetails);

  const handleOpenMap = () => {
    setIsMapOpen(true);
  };

  const handleCloseMap = () => {
    setIsMapOpen(false);
  };

  useEffect(() => {
    fetchHotelDetails();
    checkWishlistStatus();
    fetchRatings();
    fetchAverageRatings()
  }, []);

  const fetchHotelDetails = async () => {
    try {
      const response = await axiosInstance.get(`${localhost}/api/getPropertyDetails/${id}`);
      const data = response.data;
      setPropertyDetails(data);
      const newCategories = {
        'Things nearby': [],
        "Cafe's and Restaurants": [],
        'Transportation': []
      };

      if (data.surroundings) {
        data.surroundings.forEach(surrounding => {
          if (newCategories[surrounding.category]) {
            newCategories[surrounding.category].push(surrounding);
          }
        });
      }

      setsurrCategories(newCategories);
    
    } catch (error) {
      console.error('Error fetching hotel data:', error);
    }
  };

  const fetchRatings = async () => {
    try {
      const response = await axiosInstance.get(`${localhost}/api/getRatings/${id}`);
      setRatings(response.data);
      
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const fetchAverageRatings = async () => {
    try {
        const response = await axiosInstance.get(`${localhost}/api/property/${id}/average-rating`);
        setAverageRatings(response.data);
        console.log("avgrating",response.data);

    } catch (error) {
        console.error('Error fetching average ratings', error);
    }
};

  const checkWishlistStatus = async () => {
    try {
      const response = await axiosInstance.get(`${localhost}/api/check-wishlist`, { params: { userEmail, propertyId: id } });
      setIsInWishlist(response.data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const toggleWishlistStatus = async () => {
    try {
      const response = await axiosInstance.post(`${localhost}/api/toggle-wishlist`, { userEmail, propertyId: id });
      setIsInWishlist(response.data.isInWishlist);
      fetchHotelDetails();
      toast.success("Property added to wishlist!", {
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
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const removeFromWishlist = async () => {
    try {
      const response = await axiosInstance.post(`${localhost}/api/remove-from-wishlist`, { userEmail, propertyId: id });
      setIsInWishlist(!response.data.isInWishlist);
      fetchHotelDetails();
      toast.success("Property removed from wishlist!", {
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
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const openModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedImage('');
  };

  const handleCheckAvailability = (roomCategory) => {
    setSelectedRoomCategory(roomCategory);
    setAvailabilityModalIsOpen(true);
  };

  const closeAvailabilityModal = () => {
    setAvailabilityModalIsOpen(false);
    setErrorMessage('');
  };

  const handleAvailabilitySubmit = async () => {
    setErrorMessage('');
  
    if (!checkInDate || !checkOutDate) {
      setErrorMessage('Please select both check-in and check-out dates.');
      return;
    }
  
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setErrorMessage('Check-out date must be after check-in date.');
      return;
    }
  
    if (new Date(checkInDate) <= new Date()) {
      setErrorMessage('Check-in date must be in the future.');
      return;
    }
  
    if (new Date(checkOutDate) <= new Date()) {
      setErrorMessage('Check-out date must be in the future.');
      return;
    }
  
    if (rooms < 1 || travellers < 1) {
      setErrorMessage('Number of rooms and travellers must be at least 1.');
      return;
    }
  
  
  const numRooms = Number(rooms);
  const numTravellers = Number(travellers);

  if (numRooms > numTravellers) {
    setErrorMessage('Number of rooms cannot be greater than the number of travellers.');
    return;
  }


  const selectedRoom = propertyDetails.rooms.find(room => room.category === selectedRoomCategory);
  if (selectedRoom) {
    const maxGuestsAllowed = selectedRoom.guests * numRooms;
    if (numTravellers > maxGuestsAllowed) {
      setErrorMessage(`Exceeded guest capacity for the selected room! Maximum ${maxGuestsAllowed} guests allowed.`);
      return;
    }
  } else {
    setErrorMessage('Selected room category not found.');
    return;
  }

  try {
    const response = await axiosInstance.post(`${localhost}/api/check-roomAvailability`, {
      propertyId: id,
      roomCategory: selectedRoomCategory,
      checkInDate,
      checkOutDate,
      travellers: numTravellers,
      rooms: numRooms,

    });

  
      const { available, message } = response.data;
  
      if (available) {
        setIsRoomAvailable(true);
        toast.success('Rooms are available for the selected dates!', {
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
      } else {
        setIsRoomAvailable(false);
        setErrorMessage(message || 'No rooms available for the selected dates.');
        toast.error( message, {
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
      console.error('Error checking availability:', error);
      setErrorMessage('Error checking availability.');
    }
  
    // closeAvailabilityModal();
  };
  
  const handleBookNow = async () => {
    const numRooms = Number(rooms);
    const numTravellers = Number(travellers);
    const hotelname = propertyDetails.name;
    const selectedRoom = propertyDetails.rooms.find(room => room.category === selectedRoomCategory);
  
    if (userEmail === propertyDetails.email) {
      setOwnerBookingModalIsOpen(true);
      return;
    }
  
  //   const queryParams = new URLSearchParams({
  //     roomCategory: selectedRoomCategory,
  //     hotelname: hotelname,
  //     checkInDate,
  //     checkOutDate,
  //     travellers: numTravellers,
  //     rooms: numRooms,
  //     roomId: selectedRoom._id,
  //     userEmail: userEmail,
  //   }).toString();
  //   router.push(`/checkout?${queryParams}`);
  const checkoutData = {
    roomCategory: selectedRoomCategory,
    hotelname: hotelname,
    checkInDate,
    checkOutDate,
    travellers: numTravellers,
    rooms: numRooms,
    roomId: selectedRoom._id,
    userEmail: userEmail,
  };

  setCheckoutDetails(checkoutData);
  router.push('/checkout');
  };
  
  if (!propertyDetails.name) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Carousel showThumbs={false} autoPlay={true} infiniteLoop={true}>
            {propertyDetails.photos.map((image, index) => (
              <div key={index} onClick={() => openModal(`${localhost}/uploads/${image}`)}>
                <img 
                  src={`${localhost}/uploads/${image}`}
                  alt={`Hotel Image ${index + 1}`}
                  width={600}
                  height={400}
                  className="object-cover cursor-pointer"
                />
               
              </div>
            ))}
          </Carousel>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{propertyDetails.name}</h2>
            <button
              onClick={isInWishlist ? removeFromWishlist : toggleWishlistStatus}
              className={`text-2xl ${isInWishlist ? 'text-red-500' : 'text-gray-300'}`}
            >
              <FaHeart />
            </button>
          </div>
          <p className="text-gray-500">{propertyDetails.destination} - <a href="#"  onClick={handleOpenMap} className="text-blue-700">See Map</a></p>
          <GoogleMapViewModal
            isOpen={isMapOpen}
            onClose={handleCloseMap}
            latitude={propertyDetails.location.latitude}
            longitude={propertyDetails.location.longitude}
          />
         
          <p className="mt-2">{propertyDetails.description}</p>
          <div className="bg-white p-4 rounded-lg shadow-md mt-4">
            <p className="text-2xl font-bold"> {averageRatings?.overallAverage ? averageRatings.overallAverage.toFixed(1) : 'No rating'} Excellent</p>
            <p className="text-gray-500">{ratings.length} Reviews</p>
            <div className="mt-2">
            <p
  className={`bg-black ${
    averageRatings?.location >= 4
      ? 'hover:bg-green-600'
      : averageRatings?.location >= 3
      ? 'hover:bg-yellow-600'
      : averageRatings?.location >= 2
      ? 'hover:bg-orange-600'
      : 'hover:bg-blue-600'
  } text-white p-2 rounded-md`}
>
  Location {averageRatings?.location ? averageRatings.location.toFixed(1) : 'No rating'}
</p>

<p
  className={`bg-black ${
    averageRatings?.cleanliness >= 4
      ? 'hover:bg-green-600'
      : averageRatings?.cleanliness >= 3
      ? 'hover:bg-yellow-600'
      : averageRatings?.cleanliness >= 2
      ? 'hover:bg-orange-600'
      : 'hover:bg-blue-600'
  } text-white p-2 rounded-md mt-1`}
>
  Cleanliness {averageRatings?.cleanliness ? averageRatings.cleanliness.toFixed(1) : 'No rating'}
</p>

<p
  className={`bg-black ${
    averageRatings?.service >= 4
      ? 'hover:bg-green-600'
      : averageRatings?.service >= 3
      ? 'hover:bg-yellow-600'
      : averageRatings?.service >= 2
      ? 'hover:bg-orange-600'
      : 'hover:bg-blue-600'
  } text-white p-2 rounded-md mt-1`}
>
  Service {averageRatings?.service ? averageRatings.service.toFixed(1) : 'No rating'}
</p>

<p
  className={`bg-black ${
    averageRatings?.facilities >= 4
      ? 'hover:bg-green-600'
      : averageRatings?.facilities >= 3
      ? 'hover:bg-yellow-600'
      : averageRatings?.facilities >= 2
      ? 'hover:bg-orange-600'
      : 'hover:bg-blue-600'
  } text-white p-2 rounded-md mt-1`}
>
  Facilities {averageRatings?.facilities ? averageRatings.facilities.toFixed(1) : 'No rating'}
</p>

            </div>
          </div>
          <div className="mt-4 p-2 bg-gray-100 rounded-lg shadow-md w-full">
      <h3 className="text-lg font-bold mb-4">User Reviews</h3>
      <Carousel
        showThumbs={false}
        autoPlay={true}
        infiniteLoop={true}
        emulateTouch={true}
        interval={5000}
        className="overflow-hidden"
      >
        {ratings.map((rating, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow-md flex items-start">
            <div className="w-12 h-12 flex-shrink-0">
              <img
                alt={rating.userName}
                src={rating.userPhoto ? rating.userPhoto : '/images/defaultdp.jpg'}
                width={48} 
                height={48}
                className="rounded-full object-cover w-full h-full"
              />
            </div>
            <div className="ml-3"> 
              <span className="font-semibold text-sm">{rating.userName}</span>
              <Rating
                count={5}
                value={rating.rating.average}
                size={20}
                edit={false}
                activeColor="#ffd700"
              />
              <p className="text-gray-700 text-sm mt-1 block"><em>&quot;{rating.review}&quot;</em></p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>

        </div>
      </div>    
      <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-xl font-bold">Facilities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
          {propertyDetails.facilities.map((facility, index) => (
            <p key={index}>{facility.facility}</p>
          ))}
        </div>
        <div className="mt-4">
          <p className="text-green-600">Check-in - 12.00 PM</p>
          <p className="text-red-600">Check-out - 11.00 AM</p>
        </div>
      </div>
      <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-xl font-bold">Available Rooms</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 bg-gray-200">Room Category</th>
              <th className="py-2 px-4 bg-gray-200">Number of Guests</th>
              <th className="py-2 px-4 bg-gray-200">Amount for 1 day</th>
              <th className="py-2 px-4 bg-gray-200">Action</th>
            </tr>
          </thead>
          <tbody>
            {propertyDetails.rooms.map((room, index) => (
              <tr key={index}>
                <td className="text-center border px-4 py-2">{room.category}</td>
                <td className="text-center border px-4 py-2">{room.guests}</td>
                <td className="text-center border px-4 py-2">₹{room.price}</td>
                <td className="text-center border px-4 py-2">
                <button 
                  onClick={() => handleCheckAvailability(room.category)} 
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-110"
                >
                  Check Availability
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
      <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md">
      <h3 className="text-xl font-bold">Hotel Surroundings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
        {Object.keys(surrCategories).map((category, index) => (
          <div key={index} className={`pr-4 ${index < Object.keys(surrCategories).length - 1 ? 'border-r border-gray-300' : ''}`}>
            <h4 className="text-lg font-semibold mb-2">{category}</h4>
            {surrCategories[category].map((item, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{item.place}</span>
                <span>{item.distance}m</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
      <Modal 
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative bg-white p-4 rounded">
          <button 
            onClick={closeModal} 
            className="absolute top-2 right-2 text-black bg-gray-200 rounded-full p-2"
          >
            &times;
          </button>
          {selectedImage && (
            <Image 
              src={selectedImage} 
              alt="Expanded Image" 
              width={800} 
              height={600} 
              className="w-full h-auto object-cover"
            />
          )}
        </div>
      </Modal>
      <Modal 
        isOpen={availabilityModalIsOpen}
        onRequestClose={closeAvailabilityModal}
        contentLabel="Availability Check Modal"
        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="relative bg-white p-6 rounded-lg">
          <button 
            onClick={closeAvailabilityModal} 
            className="absolute top-2 right-2 text-black bg-gray-200 rounded-full p-2"
          >
            &times;
          </button>
          <h2 className="text-xl font-bold mb-4 mx-4">Check Room Availability</h2>
          <p className="text-gray-700 mb-4">Selected Room Category: {selectedRoomCategory}</p>
          <div className="mb-4">
            <label className="block text-gray-700">Check-in Date:</label>
            <input 
              type="date" 
              value={checkInDate} 
              onChange={(e) => setCheckInDate(e.target.value)} 
              className="w-full mt-2 p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Check-out Date:</label>
            <input 
              type="date" 
              value={checkOutDate} 
              onChange={(e) => setCheckOutDate(e.target.value)} 
              className="w-full mt-2 p-2 border rounded-lg"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Number of Travellers:</label>
            <input 
              type="number" 
              value={travellers} 
              onChange={(e) => setTravelers(e.target.value)} 
              className="w-full mt-2 p-2 border rounded-lg"
              min="1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Quantity of Rooms:</label>
            <input 
              type="number" 
              value={rooms} 
              onChange={(e) => setRooms(e.target.value)} 
              className="w-full mt-2 p-2 border rounded-lg"
              min="1"
            />
          </div>
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <button 
            onClick={handleAvailabilitySubmit} 
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Check Availability
          </button>
          {isRoomAvailable && (
           <button
             onClick={handleBookNow}
             className="bg-green-500 text-white mx-5 py-2 px-4 rounded"
           >
             Book Now
           </button>
         )}
        </div>
      </Modal>
      <Modal
  isOpen={ownerBookingModalIsOpen}
  onRequestClose={() => setOwnerBookingModalIsOpen(false)}
  contentLabel="Owner Booking Modal"
  className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center"
  overlayClassName="fixed inset-0 bg-black bg-opacity-50"
>
  <div className="relative bg-white p-6 rounded-lg">
    <button
      onClick={() => setOwnerBookingModalIsOpen(false)}
      className="absolute top-2 right-2 text-black bg-gray-200 rounded-full p-2"
    >
      &times;
    </button>
    <h2 className="text-xl font-bold mb-4">Cannot Book Your Own Property</h2>
    <p className="text-gray-700 mb-4">You cannot book your own property.</p>
    <button
      onClick={() => setOwnerBookingModalIsOpen(false)}
      className="bg-blue-500 text-white py-2 px-4 rounded-lg"
    >
      Close
    </button>
  </div>
</Modal>

    </div>
  );
};

export default HotelDetail;
