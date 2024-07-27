"use client"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { localhost } from '@/url';

const PER_PAGE = 10;

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(localhost+'/admin/customers');
      setCustomers(response.data);
      setFilteredCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleBlockCustomer = async (customerId) => {
    try {
      await axios.put(`${localhost}/${customerId}/block`);
      toast.success('Customer blocked successfully', {
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
      fetchCustomers(); // refresh customer list after blocking
    } catch (error) {
      console.error('Error blocking customer:', error);
      toast.error('Failed to block customer. Please try again later.', {
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

  const handleUnblockCustomer = async (customerId) => {
    try {
      await axios.put(`${localhost}/${customerId}/unblock`);
      toast.success('Customer unblocked successfully', {
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
      fetchCustomers(); // refresh customer list after unblocking
    } catch (error) {
      console.error('Error unblocking customer:', error);
      toast.error('Failed to unblock customer. Please try again later.', {
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

  const handleSearchChange = (event) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchInput(searchValue);
    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchValue) ||
      customer.email.toLowerCase().includes(searchValue) 
      // customer.mobile.toLowerCase().includes(searchValue) ||
      // customer.nationality.toLowerCase().includes(searchValue)
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1); // Reset to the first page on search
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + PER_PAGE);
  const totalPages = Math.ceil(filteredCustomers.length / PER_PAGE);

  return (
    <div>
      <ToastContainer />
      <p className="p-6 text-lg font-bold">Customers</p>

      <div className="flex justify-between items-center mb-4 mx-4">
        <h2 className="text-base">Existing Customers</h2>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search customers..."
          className="border rounded px-4 py-2"
        />
      </div>

      <div className="mx-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr className="bg-gray-200">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl No</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile Picture</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationality</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedCustomers.map((customer,index) => (
              <tr key={customer._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-4 whitespace-nowrap">{index+1}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                   {customer.profilePic ? (
                     <img 
                       src={customer.profilePic} 
                       alt="Profile Picture" 
                       className="w-10 h-10 rounded-full object-cover"
                     />
                   ) : (
                     <span>Not Added</span>
                   )}
                 </td>
                 
                <td className="border border-gray-300 px-4 py-4 whitespace-nowrap">{customer.name}</td>
                <td className="border border-gray-300 px-4 py-4 whitespace-nowrap">{customer.email}</td>
                <td className="border border-gray-300 px-4 py-4 whitespace-nowrap">{customer.mobile ? customer.mobile : "Not Added"}</td>
                <td className="border border-gray-300 px-4 py-4 whitespace-nowrap">{customer.nationality  ? customer.nationality : "Not Added"}</td>
                <td className="border border-gray-300 px-4 py-4 whitespace-nowrap">{customer.isBlocked ? 'Blocked' : 'Active'}</td>
                <td className="border border-gray-300 px-4 py-4 whitespace-nowrap">
                  <button
                    className={`bg-${customer.isBlocked ? 'green' : 'red'}-500 hover:bg-${customer.isBlocked ? 'green' : 'red'}-600 text-white font-light py-1 px-2 rounded mr-2`}
                    onClick={customer.isBlocked ? () => handleUnblockCustomer(customer._id) : () => handleBlockCustomer(customer._id)}
                  >
                    {customer.isBlocked ? 'Unblock' : 'Block'}
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

export default Customers;
