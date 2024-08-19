"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthStore } from "../../../store/store"
import { jwtDecode } from 'jwt-decode';
import { set } from 'date-fns';
import { localhost } from '../../../url';
import axiosInstance from '@/utils/axios';

const Subscriptions = () => {
    const router = useRouter();
    const [amount, setAmount] = useState(100);
    const [isPremium,setisPremium] = useState()
    const [Email,setEmail] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    const handleCancel = async() => {
    try{
        const result = await axiosInstance.put(localhost+"/api/cancelPremium",{
            email:Email
        })
        if (result.data.success) {
            toast.success(`Your subscription cancellation was successful!`, {
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
            console.log(result.data.message);
            toast.error(`There was an issue cancelling your subscription. Please contact support.`, {
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
            console.error("Error cancelling subscription:", error);
            toast.error(`There was an issue cancelling your subscription. Please contact support.`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            })
        }
        closeModal();
  };
         
     
       
    useEffect(() => {
        const fetchUserDetails = async () => {
          const token = localStorage.getItem('usertoken');
          if (token) {
            const decodedToken = jwtDecode(token);
            const userEmail = decodedToken.email;
            console.log(userEmail);
             
            try {
              const response = await axios.get(`${localhost}/user/getuser?email=${userEmail}`);
              setEmail(response.data.email);
              setisPremium(response.data.premium);
            } catch (error) {
              console.error('There was a problem with the axios operation:', error);
            }
          }
        };
    
        fetchUserDetails();
      }, []);
    

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        try {
            const res = await fetch('/api/premium', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: parseFloat(amount) }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();

            const options = {
                key_id: 'rzp_test_EnGfdFv0m1DG7S',
                amount: data.amount,
                currency: 'INR',
                name: 'Voyage',
                description: 'Premium Subscription',
                image: './images/admlogo.png',
                order_id: data.id,
                handler: async function (response) {
                    try {
                      const result = await axios.post(localhost+"/updatePremiumStatus", {
                        email: Email,
                        // paymentId: response.razorpay_payment_id,
                      });
                  
                      if (result.data.success) {
                        toast.success(`Your payment was successful! Enjoy your premium membership.`, {
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
                        toast.error(`There was an issue updating your premium status. Please contact support.`, {
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
                        console.error("Error updating premium status:", error);
                        toast.error(`There was an issue updating your premium status. Please contact support.`, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                            transition: Bounce,
                        })
                    }
                },
                prefill: {
                    name: 'Test User',
                    email: 'test.user@example.com',
                    contact: '9999999999',
                },
                notes: {
                    address: 'Razorpay Corporate Office',
                },
                theme: {
                    color: '#0C0DFA',
                },
            };

            const rzpInstance = new window.Razorpay(options);
            rzpInstance.open();
        } catch (error) {
            console.error('Payment error:', error);
            toast.error('Payment failed. Please try again later.', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    return (
        <div className='p-6'>
            <ToastContainer />
            <p className='mb-2 text-lg font-bold'>Subscriptions</p>
            {!isPremium ? 
            <div className="mx-auto p-6 max-w-2xl rounded-3xl ring-1 ring-gray-200 lg:mx-0 lg:flex lg:max-w-none">
                <div className="p-8 sm:p-10 lg:flex-auto">
                    <h3 className="text-xl font-bold tracking-tight text-gray-900">Lifetime membership</h3>
                    <p className="mt-6 text-base leading-7 text-gray-600">Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque amet indis perferendis blanditiis repellendus etur quidem assumenda.</p>
                    <div className="mt-10 flex items-center gap-x-4">
                        <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">What’s included</h4>
                        <div className="h-px flex-auto bg-gray-100"></div>
                    </div>
                    <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6">
                        <li className="flex gap-x-3">
                            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"></path>
                            </svg>
                            Browse Destinations
                        </li>
                        <li className="flex gap-x-3">
                            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"></path>
                            </svg>
                            Monthly Coupons
                        </li>
                        <li className="flex gap-x-3">
                            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"></path>
                            </svg>
                            Write Blogs
                        </li>
                        <li className="flex gap-x-3">
                            <svg className="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd"></path>
                            </svg>
                            List your property
                        </li>
                    </ul>
                </div>
                <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                    <div className="rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                        <div className="mx-auto max-w-xs px-8">
                            <p className="text-base font-semibold text-gray-600">Pay once, own it forever</p>
                            <p className="mt-6 flex items-baseline justify-center gap-x-2">
                                <span className="text-5xl font-bold tracking-tight text-gray-900">₹10,000</span>
                                <span className="text-sm font-semibold leading-6 text-gray-600">INR</span>
                            </p>
                            <button onClick={handlePayment} className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                Get access
                            </button>
                            <p className="mt-6 text-xs leading-5 text-gray-600">Invoices and receipts available for easy company reimbursement</p>
                        </div>
                    </div>
                </div>
            </div>
            : 
            <div className="text-center p-8 max-w-xl mx-auto border border-gray-200 rounded-lg shadow-md">
            <div className="text-6xl mb-4">
              <span role="img" aria-label="thumbs up">👍</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">You’re already subscribed!</h1>
            <p className="text-lg mb-6">We're glad you're interested in VOYAGE! Enjoy your membership.</p>
            <div className="flex justify-center space-x-4 mb-4">
              <button className="bg-black text-white py-2 px-4 rounded hover:bg-red-600 hover:text-white" onClick={openModal}>Cancel Subscription</button>
            </div>
            <p className="text-sm text-gray-500">Cancel within 6 months for a 50% refund. No refunds after 6 months.</p>
      
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                  <h2 className="text-xl font-semibold mb-4">Confirm Cancellation</h2>
                  <p className="mb-4">Are you sure you want to cancel your subscription?</p>
                 
                  <div className="flex justify-center space-x-4">
                    <button className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400" onClick={closeModal}>Close</button>
                    <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700" onClick={handleCancel}>Cancel Subscription</button>
                  </div>
                </div>
              </div>
            )}
          </div>
            }
        </div>
    );
};

export default Subscriptions;
