"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { localhost } from '@/url';
import  getEmailFromToken  from '@/utils/decode';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Saved = () => {
  const [wishlistProperties, setWishlistProperties] = useState([]);
  const userEmail = getEmailFromToken();
  const router = useRouter();

  useEffect(() => {
    fetchWishlistProperties();
  }, []);

  const fetchWishlistProperties = async () => {
    try {
      const response = await axios.get(`${localhost}/api/get-wishlist`, { params: { userEmail } });
      setWishlistProperties(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching wishlist properties:', error);
    }
  };

  const removeFromWishlist = async (propertyId) => {
    try {
      await axios.post(`${localhost}/api/remove-from-wishlist`, { userEmail, propertyId });
      fetchWishlistProperties(); // Refresh the list after removal
      toast.success(`Property removed from wishlist!`, {
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
      toast.error(`There was an issue removing from wishlist.`, {
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

  const viewProperty = (propertyId) => {
    router.push(`/property/${propertyId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <ToastContainer />
      <p className="text-lg font-bold mb-4">Saved Properties</p>
      {wishlistProperties.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        wishlistProperties.map(property => (
          <div key={property._id} className="mb-6 p-4 bg-white rounded-lg shadow-md flex items-center">
            <div className="w-1/3">
              <Image 
                src={`${localhost}/uploads/${property.photos[0]}`} 
                alt={property.name}
                width={150}
                height={100}
                className="object-cover rounded-lg"
              />
            </div>
            <div className="w-2/3 pl-4">
              <h3 className="text-xl font-bold">{property.name}</h3>
              <div className="mt-2 flex space-x-4">
                <button 
                  onClick={() => removeFromWishlist(property._id)} 
                  className="bg-red-500 text-white p-2 rounded-lg"
                >
                  Remove from Wishlist
                </button>
                <button 
                  onClick={() => viewProperty(property._id)} 
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Saved;
