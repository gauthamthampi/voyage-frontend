// components/Payment.js
'use client'
import React, { useState, useEffect } from 'react';
import razorpay from '../../lib/razorpay';

const Payment = () => {
  const [razorpayOrder, setRazorpayOrder] = useState(null);

  useEffect(() => {
    const createOrder = async () => {
      const options = {
        amount: 100000, // ₹10,000 in paise
        currency: 'INR',
        receipt: 'receipt#123',
        payment_capture: 1,
      };

      try {
        const response = await razorpay.orders.create(options);
        setRazorpayOrder(response);
      } catch (error) {
        console.error(error);
      }
    };

    createOrder();
  }, []);

  const handlePayment = () => {
    const options = {
      key: process.env.RAZORPAY_KEY_ID,
      amount: 100000, // ₹10,000 in paise
      currency: 'INR',
      name: 'Your Company Name',
      description: 'Test payment',
      image: 'https://example.com/logo.png',
      order_id: razorpayOrder.id,
      handler: (response) => {
        // Handle payment response
        console.log(response);
      },
      prefill: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Some address',
      },
      theme: {
        color: '#F37254',
      },
    };

    const rzp1 = new razorpay(options);
    rzp1.open();
  };

  return (
    <div>
      <h1>Payment Form</h1>
      <button type="button" onClick={handlePayment}>
        Pay ₹10,000
      </button>
    </div>
  );
};

export default Payment;