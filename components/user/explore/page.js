'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { localhost } from '../../../url';

const PER_PAGE = 5;

const Explore = () => {
  const [destination, setDestination] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    fetchAllHotels();
    fetchAllDestinations();
  }, []);

  const fetchAllDestinations = async () => {
    try {
      const response = await axios.get(localhost+'/getDestinations');
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const fetchAllHotels = async () => {
    try {
      const response = await axios.get(localhost+'/api/getAllProperties');
      setHotels(response.data);
      setFilteredHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotel data:', error);
    }
  };

  const handleDestinationChange = (event) => {
    setDestination(event.target.value);
  };

  const applyFilters = () => {
    // Filter hotels based on the selected destination and search input
    const filtered = hotels.filter(hotel => 
      (destination === '' || hotel.destination === destination) &&
      (searchInput === '' || hotel.name.toLowerCase().includes(searchInput.toLowerCase()))
    );
    setFilteredHotels(filtered);
    setCurrentPage(1); // Reset to the first page on filter
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    applyFilters();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginatedHotels = filteredHotels.slice(startIndex, startIndex + PER_PAGE);
  const totalPages = Math.ceil(filteredHotels.length / PER_PAGE);

  const handleBooknow = (id) => {
    router.push(`/hotel/${id}`);
  };

  return (
    <div className="container mx-auto p-6 flex">
      <div className="w-1/4 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-xl font-bold mb-4">Filter by</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Destination</h3>
          <select 
            value={destination} 
            onChange={handleDestinationChange} 
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Destination</option>
            {destinations.map((dest, index) => (
              <option key={index} value={dest.name}>{dest.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={applyFilters} 
          className="w-full bg-blue-500 text-white p-2 rounded-lg"
        >
          Apply Changes
        </button>
      </div>
      <div className="w-3/4 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Showing All Properties</h2>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search your favourite hotels..."
            className="border p-2 rounded-lg w-1/3"
          />
        </div>
        <div className="grid gap-4">
          {paginatedHotels.map((hotel, index) => (
            <div key={index} className="flex bg-white p-4 rounded-lg shadow-lg">
              <Image
                src={`${localhost}/uploads/${hotel.photos[0]}`}
                alt={hotel.name}
                width={150}
                height={150}
                className="w-1/3 rounded-lg object-cover"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-xl font-bold">{hotel.name}</h3>
                <p className="text-gray-500">{hotel.location} - <a href="#" className="text-blue-700">Show on Map</a> - {hotel.distance}KM from Downtown</p>
                <p className="mt-2">{hotel.description}</p>
              </div>
              <div className="flex flex-col justify-between items-end">
                <div className="flex">
                  {Array(hotel.rating).fill().map((_, i) => (
                    <span key={i} className="text-yellow-500">★</span>
                  ))}
                </div>
                <button onClick={() => handleBooknow(hotel._id)} className="bg-green-500 text-white p-2 rounded-lg">Book Now</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button 
              key={page} 
              onClick={() => handlePageChange(page)}
              className={`mx-2 px-4 py-2 border rounded ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
