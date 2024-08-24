'use client'
import { localhost } from '@/url';
import axios from 'axios';
import axiosInstance from '../../../utils/axios';
import { useRouter, } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookingConfirmation from '../bookingconfirmation/confirm';
import CouponModal from './couponmodal'; 
import { useAuthStore } from '@/store/store';

const Checkout = () => {
  const router = useRouter();
  const [roomDetails,setRoomDetails] = useState([])
  const [hotelDetails,setHotelDetails] = useState([])
  const initialize = useAuthStore((state) => state.initialize);
  const checkoutDetails = useAuthStore((state) => state.checkoutDetails);
  const hotelname = checkoutDetails.hotelname
  const roomCategory = checkoutDetails.roomCategory
  const checkInDate = checkoutDetails.checkInDate
  const checkOutDate = checkoutDetails.checkOutDate
  const travellers = checkoutDetails.travellers
  const rooms = checkoutDetails.rooms
  const roomId = checkoutDetails.roomId
  const userEmail = checkoutDetails.userEmail
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isCouponModalOpen, setCouponModalOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [coupons, setCoupons] = useState([]); 
  const [totalAmountToPay, setTotalAmountToPay] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0); 


  useEffect(() => {
    initialize();
  }, [initialize]);

  const fetchHotelDetails = async ()=>{
    const response = await axiosInstance.get(`${localhost}/api/checkout/getHotelDetails`, { params: { roomId } })
    console.log(response.data);
    setHotelDetails(response.data.hotel)
    setRoomDetails(response.data.room)
  }

  const fetchCouponDetails = async()=>{    
    const response = await axiosInstance.get(localhost+'/api/getUserCoupons', {params:{userEmail}})
    console.log(response.data,"coup");
    setCoupons(response.data.coupons)
    
  }

  const calculateDays = (checkInDate, checkOutDate) => {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const differenceInTime = checkOut.getTime() - checkIn.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  const calculateTotalAmount = async() => {
    const numberOfDays = calculateDays(checkInDate, checkOutDate);
    const price = roomDetails.price * numberOfDays * rooms;    
    setTotalPrice(price); 

    let totalAmount = price + 100; 
    
    if (appliedCoupon) {
      const discountAmount = (totalAmount * appliedCoupon.discountValue) / 100;
      totalAmount -= discountAmount;
    }

    setTotalAmountToPay(totalAmount); 
  };

  const handleCouponModalOpen = () => setCouponModalOpen(true);
  const handleCouponModalClose = () => setCouponModalOpen(false);

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    calculateTotalAmount();

  };

  const handleApplyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
    calculateTotalAmount();

  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        await fetchHotelDetails(); 
        await fetchCouponDetails(); 
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
  
    fetchDetails();
  
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []); 
  
  useEffect(() => {
    if (roomDetails && roomDetails.price) {
      calculateTotalAmount();
    }
  }, [roomDetails, appliedCoupon, checkInDate, checkOutDate, rooms]); 
  
  
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [countryCode, setCountryCode] = useState('+1'); 
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);


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
              noofdays:calculateDays(checkInDate, checkOutDate),
              propertyId:hotelDetails._id,
              checkInDate,
              checkOutDate,
              travellers,
              rooms,
              roomId,
              amount: totalAmountToPay,
              bookingDate,
              coupon: appliedCoupon ? { id: appliedCoupon._id } : undefined 
            };
            
            setShowSuccessModal(true);
            setBookingDetails(bookingData)
            const result = await axiosInstance.post(`${localhost}/api/createbooking`, bookingData);
  
            if (result.data.success) {
              setShowSuccessModal(true);
              setTimeout(() => {
                router.push(`/bookingconfirmation/${result.data.booking._id}`);
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
  
  if (!checkoutDetails) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div role="status" className="flex flex-col items-center">
                <svg
                    aria-hidden="true"
                    className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                    />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                    />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}

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
            
          </select>
        </div>
        {appliedCoupon ? (
          <button
            onClick={handleRemoveCoupon}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 "
          >
            Coupon Applied
            <span className="ml-2 cursor-pointer">×</span>
          </button>
        ) : (
          <button
            onClick={handleCouponModalOpen}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Apply Coupon
          </button>
        )}
      {isCouponModalOpen && (
        <CouponModal
          coupons={coupons} // Pass the user's coupons to the modal
          onClose={handleCouponModalClose}
          onApply={handleApplyCoupon}
        />
      )}
        <button
          onClick={handlePayment}
          className="bg-blue-500 text-white p-2 rounded-lg ml-5"
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
      {bookingDetails && <BookingConfirmation bookingDetails={bookingDetails} />}
    </div>
  );
};

export default Checkout;
