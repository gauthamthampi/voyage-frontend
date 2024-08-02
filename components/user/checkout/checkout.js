'use client'
import { localhost } from '@/url';
import axios from 'axios';
import { useRouter,useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams()
  const [roomDetails,setRoomDetails] = useState([])
  const [hotelDetails,setHotelDetails] = useState([])
  const hotelname = searchParams.get('hotelname')
  const roomCategory = searchParams.get('roomCategory');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');
  const travellers = searchParams.get('travellers');
  const rooms = searchParams.get('rooms');
  const roomId = searchParams.get('roomId');
  const userEmail = searchParams.get('userEmail');


  const fetchHotelDetails = async ()=>{
    const response = await axios.get(`${localhost}/api/checkout/getHotelDetails`, { params: { roomId } })
    console.log(response.data);
    setHotelDetails(response.data.hotel)
    setRoomDetails(response.data.room)
  }

  const calculateDays = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const differenceInTime = checkOut.getTime() - checkIn.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  useEffect(()=>{
    fetchHotelDetails()
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
        document.body.removeChild(script);
    };
  },[])
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [countryCode, setCountryCode] = useState('+1'); 
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

const numberOfDays = calculateDays(checkInDate, checkOutDate);
const totalPrice = roomDetails.price * numberOfDays;
const totalAmountToPay = totalPrice + 100; 
// const totalAmountToPay = 10; 


  const validate = (trimmedName) => {
    const newErrors = {};
    if (!trimmedName) newErrors.name = 'Name is required';
    if (!mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    return newErrors;
  };
 
  
  const handlePayment = async () => {
    const trimmedName = name.trim();
    const newErrors = validate(trimmedName);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    const numberOfDays = calculateDays(checkInDate, checkOutDate);
    const totalPrice = roomDetails.price * numberOfDays;
    const totalAmountToPay = totalPrice + 100; 
    // const totalAmountToPay = 10; 


    
    let paymentMethod;
    if (paymentMethod === 'cod' && totalAmountToPay > 5000) {
      toast.error( 'Cash on Delivery is not available for bookings above ₹5000. Please choose another payment method.', {
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
      return;
    }
    
    let bookingDate = new Date().toLocaleDateString()
    let paymentStatus;
    if(paymentMethod === 'cod'){
       paymentMethod = 'COD'
       paymentStatus = 'Pending'
    }else{
      paymentMethod = 'Online'
      paymentStatus = 'Paid'
    }
  
    console.log('Proceed to payment with details:', { name: trimmedName, mobile, paymentMethod });
  
    try {
      const res = await fetch('/api/premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: totalAmountToPay }),
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
        description: 'Booking',
        image: './images/admlogo.png',
        order_id: data.id,
        handler: async function (response) {
          try {
            const bookingData = {
              userName: trimmedName,
              mobile,
              userEmail,
              paymentId: response.razorpay_payment_id,
              paymentMethod,
              paymentDate:bookingDate,
              paymentStatus,
              noofdays:numberOfDays,
              propertyId:hotelDetails._id,
              checkInDate,
              checkOutDate,
              travellers,
              rooms,
              roomId,
              amount: totalAmountToPay,
              bookingDate
            };
            setShowSuccessModal(true);
            setTimeout(() => {
              router.push('/orders');
            }, 9000);
            const result = await axios.post(`${localhost}/api/createbooking`, bookingData);
  
            if (result.data.success) {
              setShowSuccessModal(true);
              setTimeout(() => {
                router.push('/orders');
              }, 4000);
            } else {
              console.log(result.data);
              toast.error( 'There was an issue with your booking. Please contact support.', {
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
            console.error("Error saving booking:", error);
            toast.error( 'There was an issue with your booking.', error, {
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
        },
        prefill: {
          name: trimmedName,
          email: 'test.user@example.com',
          contact: mobile,
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
      toast.error( 'Payment error:', error, {
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
  

  return (
    <div className="container mx-auto p-6">
            <ToastContainer />
    <h1 className='text-center mt-5 mb-10 text-2xl font-bold'>Checkout</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mx-20">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">User Details</h3>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Mobile:</label>
          <div className="flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-1/4 mt-2 p-2 border rounded-lg"
            >
              <option value="+1">+1</option>
              <option value="+91">+91</option>
              <option value="+44">+44</option>
              {/* Add more country codes as needed */}
            </select>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-3/4 mt-2 p-2 border rounded-lg ml-2"
            />
          </div>
          {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full mt-2 p-2 border rounded-lg"
          >
            <option value="online">Online</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
        <button
          onClick={handlePayment}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Proceed to Payment
        </button>
      </div>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Booking Summary</h3>
          <div className="flex justify-between">
        <p><strong>Hotel Name:</strong></p>
        <p>{hotelname}</p>
      </div>
          <div className="flex justify-between">
        <p><strong>Room Category:</strong></p>
        <p>{roomCategory}</p>
      </div>
      <div className="flex justify-between">
        <p><strong>Check-in Date:</strong></p>
        <p>{checkInDate}</p>
      </div>
      <div className="flex justify-between">
        <p><strong>Check-out Date:</strong></p>
        <p>{checkOutDate}</p>
      </div>
      <div className="flex justify-between">
        <p><strong>No of days:</strong></p>
        <p>{calculateDays(checkInDate, checkOutDate)}</p>
      </div>
      <div className="flex justify-between">
        <p><strong>Number of Travellers:</strong></p>
        <p>{travellers}</p>
      </div>
      <div className="flex justify-between">
        <p><strong>Number of Rooms:</strong></p>
        <p>{rooms}</p>
      </div>
          <div className="my-4 border-t border-gray-300"></div>
          <div>
            <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
            <div className="flex justify-between">
          <p><strong>Subtotal:</strong></p>
          <p>₹{totalPrice}</p>
        </div>
        <div className="flex justify-between">
          <p><strong>Tax:</strong></p>
          <p>₹100</p>
        </div>
            <div className="my-4 border-t border-gray-300"></div>

            <div className="flex justify-between">
          <p><strong>Total To Pay:</strong></p>
          <p className='font-bold'>₹{totalAmountToPay}</p>
        </div>
          </div>        
        </div>
      </div>
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Booking Successful!</h2>
            <p>Your booking has been successfully processed. You will be redirected to the orders page shortly.</p>
          </div>
        </div>

)}
    </div>
  );
};

export default Checkout;
