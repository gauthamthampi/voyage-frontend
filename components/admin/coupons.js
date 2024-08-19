"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { localhost } from '../../url';
import { FaEdit, FaEyeSlash, FaTrash } from 'react-icons/fa'; // Import icons from react-icons
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    description: '',
    discountValue: '',
    minPurchaseAmount: '',
  });
  const [editingCouponId, setEditingCouponId] = useState(null); // To track the coupon being edited

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(localhost + '/api/admin/getCoupons');
        setCoupons(response.data);
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCouponId) {
        // Update existing coupon
        await axios.put(`${localhost}/api/admin/editCoupon/${editingCouponId}`, newCoupon);
        setCoupons(prevCoupons => prevCoupons.map(coupon => coupon._id === editingCouponId ? { ...coupon, ...newCoupon } : coupon));
        toast.success('Coupon Edited Succesfully', {
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
        try {
          const response = await axios.post(localhost + '/api/admin/addCoupon', newCoupon);
          setCoupons(prevCoupons => [...prevCoupons, response.data]);
          toast.success('Coupon Added Successfully', {
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
          console.error('Error adding coupon:', error);
          toast.error('Failed to Add Coupon: ' + error.message, {
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
      setIsModalOpen(false);
      setNewCoupon({
        code: '',
        description: '',
        discountValue: '',
        minPurchaseAmount: '',
      });
      setEditingCouponId(null); // Reset the editing ID
    } catch (error) {
      console.error('Error adding/updating coupon:', error);
    }
  };

  const handleEdit = (id) => {
    const couponToEdit = coupons.find(coupon => coupon._id === id);
    setNewCoupon({
      code: couponToEdit.code,
      description: couponToEdit.description,
      discountValue: couponToEdit.discountValue,
      minPurchaseAmount: couponToEdit.minPurchaseAmount,
    });
    setEditingCouponId(id);
    setIsModalOpen(true);
    
  };

  const handleHide = async (id) => {
    try {
      const response = await axios.put(`${localhost}/api/admin/hideCoupon/${id}`);
      setCoupons(prevCoupons => prevCoupons.map(coupon => coupon._id === id ? response.data : coupon));
      toast.success('Coupon Visibility Changed Successfully', {
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
      console.error('Error hiding coupon:', error);
      toast.error('Failed to edit visibility.', {
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div>
            <ToastContainer />
      <div className="flex justify-between items-center p-6">
        <p className='text-lg font-bold'>Coupons</p>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setEditingCouponId(null); // Reset editing state when adding a new coupon
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add a new coupon
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/3">
            <h2 className="text-xl mb-4">{editingCouponId ? 'Edit Coupon' : 'Add New Coupon'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Code</label>
                <input
                  type="text"
                  name="code"
                  value={newCoupon.code}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  name="description"
                  value={newCoupon.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Discount Value (%)</label>
                <input
                  type="number"
                  name="discountValue"
                  value={newCoupon.discountValue}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Minimum Purchase Amount</label>
                <input
                  type="number"
                  name="minPurchaseAmount"
                  value={newCoupon.minPurchaseAmount}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded p-2"
                />
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                {editingCouponId ? 'Update Coupon' : 'Save Coupon'}
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="ml-4 bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {coupons.length === 0 ? (
        <p className="text-center text-gray-700 mt-6">No coupons available</p>
      ) : (
        <table className="min-w-full p-4 bg-white border border-gray-300 mt-6">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Code</th>
              <th className="py-2 px-4 border-b">Discount Value (%)</th>
              <th className="py-2 px-4 border-b">Min Purchase Amount</th>
              <th className="py-2 px-4 border-b">Times Used</th>
              <th className="py-2 px-4 border-b">Is Active</th>
              <th className="py-2 px-4 border-b">Timestamp</th>
              <th className="py-2 px-4 border-b">Actions</th> {/* New header for actions */}
            </tr>
          </thead>
          <tbody>
            {coupons.length > 0 ? (
              coupons.map((coupon) => (
                <tr key={coupon._id} className='text-center hover:bg-gray-100'>
                  <td className="py-2 px-4 border-b">{coupon.code}</td>
                  <td className="py-2 px-4 border-b">{coupon.discountValue}</td>
                  <td className="py-2 px-4 border-b">{coupon.minPurchaseAmount}</td>
                  <td className="py-2 px-4 border-b">{coupon.timesUsed}</td>
                  <td className="py-2 px-4 border-b">{coupon.isActive ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-4 border-b">{formatDate(coupon.timestamp)}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex justify-center space-x-2">
                      <button onClick={() => handleEdit(coupon._id)} className="text-blue-500 hover:text-blue-700" title='Edit coupon'>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleHide(coupon._id)} className="text-yellow-500 hover:text-yellow-700" title='Edit visibility'>
                        <FaEyeSlash />
                      </button>
                      
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-2 px-4 border-b text-center text-gray-500">No coupons available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Coupons;
