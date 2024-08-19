import React, { useState } from 'react';

const CouponModal = ({ coupons, onClose, onApply }) => {
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const handleApplyCoupon = () => {
    if (selectedCoupon) {
      onApply(selectedCoupon);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Select a Coupon</h3>
        <ul className="space-y-4">
          {coupons.map((coupon) => (
            <li
              key={coupon._id} // Use _id or id based on your schema
              onClick={() => setSelectedCoupon(coupon)}
              className={`p-4 border rounded cursor-pointer ${
                selectedCoupon?._id === coupon._id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100'
              }`}
            >
              <p><strong>Code:</strong> {coupon.code}</p>
              <p><strong>Description:</strong> {coupon.description}</p>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleApplyCoupon}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Apply Coupon
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
