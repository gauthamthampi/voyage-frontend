// 'use client'
// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import { useAuthStore } from '../../store/store';

// const VerifyOtp = () => {
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const [errors, setErrors] = useState({});
//   const router = useRouter();
//   const { query } = router;
//   const setLogin = useAuthStore((state) => state.setLogin);
//   const inputRefs = useRef([]);

//   useEffect(() => {
//     inputRefs.current[0].focus();
//   }, []);

//   const handleChange = (index, value) => {
//     if (/^\d?$/.test(value)) {
//       const newOtp = [...otp];
//       newOtp[index] = value;
//       setOtp(newOtp);

//       if (value && index < 3) {
//         inputRefs.current[index + 1].focus();
//       }
//     }
//   };

//   const handleKeyDown = (index, event) => {
//     if (event.key === 'Backspace' && !otp[index] && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     setErrors(validationErrors);

//     if (Object.keys(validationErrors).length > 0) {
//       return;
//     }

//     try {
//       const response = await axios.post('http://localhost:3001/verify-otp', { 
//         email: query.email, 
//         otp: otp.join(''),
//         name: query.name,
//         password: query.password
//       });

//       if (response.data.success) {
//         setLogin();
//         router.push('/');
//       } else {
//         setErrors((prevErrors) => ({ ...prevErrors, backend: response.data.message }));
//       }
//     } catch (error) {
//       console.error('There was a problem with the axios operation:', error);
//       if (error.response) {
//         setErrors((prevErrors) => ({ ...prevErrors, backend: error.response.data.message }));
//       } else {
//         setErrors((prevErrors) => ({ ...prevErrors, backend: 'Error verifying OTP. Please try again later.' }));
//       }
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (otp.join('').length !== 4) newErrors.otp = 'Please enter a valid 4-digit OTP';
//     return newErrors;
//   };

//   return (
//     <section className="bg-white dark:bg-gray-900">
//       <div className="container flex items-center justify-center min-h-screen px-6 pb-10">
//         <form className="w-full max-w-md" onSubmit={handleSubmit}>
//           <div className="flex justify-center">
//             <img className="w-auto h-32 sm:h-48" src='/images/logo.png' alt="Logo" />
//           </div>

//           <div className="flex items-center justify-center mt-3">
//             <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white">
//               Verify OTP
//             </h1>
//           </div>

//           <div className="flex justify-center space-x-2 mt-8">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 type="text"
//                 value={digit}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 maxLength="1"
//                 className="w-12 h-12 text-center text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring"
//               />
//             ))}
//           </div>
//           {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
//           {errors.backend && <p className="text-red-500 text-sm mt-1">{errors.backend}</p>}

//           <div className="mt-6">
//             <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-primary rounded-lg hover:bg-primary-focus focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
//               Verify OTP
//             </button>
//           </div>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default VerifyOtp;

"use client"
import React, { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '../../store/store';
import { toast, ToastContainer,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { localhost } from '../../url';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const password = searchParams.get('password');
  const [errors, setErrors] = useState({});
  const { isLoggedIn, initialize, setLogin } = useAuthStore();

  useEffect(() => {
    initialize();
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, initialize, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(localhost+'/verify-otp', {
        email,
        otp,
        name,
        password,
      });
    //   setLogin(true);
      router.push('/login');
      toast.success('Account created successfully!', {
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
      if (error.response) {
        setErrors((prevErrors) => ({ ...prevErrors, backend: error.response.data.message }));
        console.log(error);
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, backend: 'Error verifying OTP. Please try again later.' }));
        console.log(error);
      }
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center min-h-screen px-6 pb-10">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <img className="w-auto h-32 sm:h-48" src='/images/logo.png' alt="Logo" />
          </div>
          <div className="flex items-center justify-center mt-3">
            <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white">Verify OTP</h1>
          </div>
          <div className="relative flex items-center mt-8">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input type="text" name="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Enter OTP" />
          </div>
          {errors.backend && <p className="text-red-500 text-sm mt-1">{errors.backend}</p>}
          <div className="mt-6">
            <button type="submit" className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-orange-500 rounded-lg hover:bg-orange-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              Verify
            </button>
          </div>
        </form>
      </div>
    </section>
    </Suspense>
  );
 
};

export default VerifyOtp;
