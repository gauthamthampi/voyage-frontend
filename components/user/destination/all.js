import { useState,useEffect } from 'react';
import {useRouter} from 'next/navigation'
import { Encode_Sans,Montserrat} from 'next/font/google';
import axios from 'axios';
import { localhost } from '../../../url';

export const encode_sans = Encode_Sans({
    subsets: ['latin'],
    weight: '600', 
  });
  export const montserrat = Montserrat({
    subsets: ['latin'],
    weight: '400', 
  });

const PER_PAGE = 10;

const AllDestinationsPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchInput, setSearchInput] = useState('');
    const router = useRouter();
  
    useEffect(() => {
      const fetchDestinations = async () => {
        try {
          const response = await axios.get(localhost+'/api/getUserDestinations');
          const data = response.data;
          setDestinations(data);
          setFilteredDestinations(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching destinations:', error);
        }
      };
  
      fetchDestinations();
    }, []);
  
    const handleViewClick = (name) => {
      router.push(`/destination/${name}`);
    };
  
    const handlePageChange = (page) => {
      setCurrentPage(page);
    };
  
    const handleSearchChange = (event) => {
      const searchValue = event.target.value.toLowerCase();
      setSearchInput(searchValue);
      const filtered = destinations.filter((destination) =>
        destination.name.toLowerCase().includes(searchValue)
      );
      setFilteredDestinations(filtered);
      setCurrentPage(1);
    };
  
    const startIndex = (currentPage - 1) * PER_PAGE;
    const paginatedDestinations = filteredDestinations.slice(startIndex, startIndex + PER_PAGE);
    const totalPages = Math.ceil(filteredDestinations.length / PER_PAGE);
  
    return (
      <div className="py-8">
        <div className="flex justify-between items-center mx-20 my-8">
          <h2 className={`text-2xl font-bold`}>Showing all destinations</h2>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search destinations..."
            className="border rounded px-4 py-2"
          />
        </div>
        <div className="grid grid-cols-3 gap-8 mx-20">
          {paginatedDestinations.map((destination, index) => (
            <div key={index} className="text-center border p-4 rounded-lg">
              <img
                src={`http://localhost:3001/uploads/${destination.coverPhoto}`}
                alt={destination.name}
                className="rounded-lg w-full h-40 object-cover"
              />
              <p className={`mt-2 text-lg font-semibold ${montserrat.className}`}>{destination.name}</p>
              <button 
                onClick={() => handleViewClick(destination.name)} 
                className="mt-4 text-white bg-blue-500 px-4 py-2 rounded hover:scale-110 transition-transform duration-200 ease-in-out transform"
              >
                View
              </button>
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
    );
  };
  
  export default AllDestinationsPage;