"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession, signIn } from "next-auth/react";
import { useRouter } from 'next/navigation'
import GoogleButton from 'react-google-button'
import { useAuthStore } from '../../store/store';
import { localhost } from '../../url';

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { data: session } = useSession();
  const router = useRouter()
  const setLogin = useAuthStore((state) => state.setLogin);
  const { isLoggedIn, initialize } = useAuthStore();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    initialize();
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, initialize, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    try {
      const response = await axios.post(localhost+'/signup', formData);
      router.push(`/verify-otp?email=${formData.email}&name=${formData.name}&password=${formData.password}`);
    } catch (error) {
      if (error.response) {
        setErrors((prevErrors) => ({ ...prevErrors, backend: error.response.data.message }));
        console.log(error);
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, backend: 'Error creating user. Please try again later.' }));
        console.log(error);
      }
    }
  };

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="container flex items-center justify-center min-h-screen px-6 pb-10">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <a href='/'><img className="w-auto h-32 sm:h-48" src='/images/logo.png' alt="Logo" /></a>
          </div>
          <div className="flex items-center justify-center mt-3">
            <h1 className="mt-3 text-2xl font-semibold text-gray-800 capitalize sm:text-3xl dark:text-white">Sign up</h1>
          </div>
          <div className="relative flex items-center mt-8">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Name" />
          </div>
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          <div className="relative flex items-center mt-6">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Email address" />
          </div>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          <div className="relative flex items-center mt-6">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Password" />
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <div className="relative flex items-center mt-6">
            <span className="absolute">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-3 text-gray-300 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40" placeholder="Confirm Password" />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          {errors.backend && <p className="text-red-500 text-sm mt-1">{errors.backend}</p>}
          <div className="mt-6">
            <button type="submit" className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-orange-500 rounded-lg hover:bg-orange-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
              Sign Up
            </button>
            <div className="mt-6 text-center ">
              <p className="text-gray-500 dark:text-gray-400">or sign up with</p>
              <div className="flex items-center justify-center mt-2 gap-x-2">
                <GoogleButton onClick={() => signIn("google")} />
              </div>
            </div>
            <div className="mt-6 text-center ">
              <p className="text-sm text-gray-400">Already have an account? <a href="/login" className="text-orange-500 focus:outline-none focus:underline hover:underline">Login</a>.</p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpForm;


