"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import { localhost } from '@/url';
import { toast, ToastContainer,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const PER_PAGE = 10;

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(localhost+'/admin/getProperties');
      setProperties(response.data);
      setFilteredProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const handleView = (id) => {
    router.push(`/hotel/${id}`);
  };

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchInput(searchValue);
    const filtered = properties.filter((property) =>
      property.name.toLowerCase().includes(searchValue) ||
      property.description.toLowerCase().includes(searchValue)
    );
    setFilteredProperties(filtered);
    setCurrentPage(1); 
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleBlock = (id)=>{
    try{
     const response = axios.put(`${localhost}/${id}/blockProperty`)
     toast.success('Property blocked successfully', {
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
     fetchProperties()
   } catch (error) {
     console.error('Error blocking Property:', error);
     toast.error('Failed to block Property. Please try again later.', {
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
   }
 
   const handleUnBlock = (id) => {
     try{
       const response = axios.put(`${localhost}/${id}/unblockProperty`)
       toast.success('Property blocked successfully', {
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
       fetchProperties()
     } catch (error) {
       console.error('Error blocking destination:', error);
       toast.error('Failed to block Destination. Please try again later.', {
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
       fetchProperties()
     }
   }
 

  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + PER_PAGE);
  const totalPages = Math.ceil(filteredProperties.length / PER_PAGE);

  return (
    <div>
                  <ToastContainer />
      <p className='p-6 text-lg font-bold'>Properties</p>
      <div className='flex justify-between items-center mt-4 mx-4'>
        <h2 className='text-base mb-4'>Existing Properties</h2>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search properties..."
          className="border rounded px-4 py-2"
        />
      </div>
      <div className='mx-4'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className="bg-gray-50">
            <tr className='bg-gray-200'>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Cover Photo</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Owner</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedProperties.map((property) => (
              <tr key={property._id} className='hover:bg-gray-100'>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <img src={`${localhost}/uploads/${property.photos[0]}`} alt="Destination Cover" className='w-20 h-auto' />
                </td>
                <td className='border border-gray-300 px-4 py-4 whitespace-nowrap'>{property.name}</td>
                <td className='border border-gray-300 px-4 py-4 whitespace-nowrap'>{property.email}</td>
                <td className='border border-gray-300 px-4 py-4 whitespace-nowrap'>{property.status ? 'Active' : 'Inactive'}</td>
                <td className='border border-gray-300 px-4 py-4 whitespace-nowrap'>
                  <button
                    className='bg-blue-500 text-white font-light py-1 px-2 rounded mr-2'
                    onClick={() => handleView(property._id)}
                  >
                    View
                  </button>
                  <button 
                   className={`bg-${property.status ? 'red' : 'green'}-500 text-white font-light py-1 px-2 rounded`}
                   onClick={property.status ? () => handleBlock(property._id) : () => handleUnBlock(property._id)}
                 >
                   {property.status ? 'Block' : 'Unblock'}
                 </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default Properties;
