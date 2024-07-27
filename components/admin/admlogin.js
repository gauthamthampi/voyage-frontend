'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuthStore } from '../../store/store';
import { localhost } from '../../url';

const AdmLogin = () => {
  const router = useRouter();
  const isAdminLoggedIn = useAuthStore((state) => state.isAdminLoggedIn);
  const setAdminLogin = useAuthStore((state) => state.setAdminLogin);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.password) newErrors.password = 'Password is required';
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
      const response = await axios.post(localhost+'/adminlogin', formData);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setAdminLogin(token);
      console.log('Token stored in local storage');
      console.log(response.data);
      setErrors({});
      window.location.href = '/admin';
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);

      if (error.response && error.response.data && error.response.data.message) {
        setErrors((prevErrors) => ({ ...prevErrors, backend: error.response.data.message }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, backend: 'Error logging in. Please try again later.' }));
      }
    }
  };

  useEffect(() => {
    if (isAdminLoggedIn) {
      router.push('/admin');
    }
  }, [isAdminLoggedIn, router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-xl py-6 px-8 bg-white rounded shadow-xl">
        <div className="flex justify-center mb-4">
          <img src="/images/admlogo.png" alt="logo" className="h-24 w-24" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-gray-800 font-bold">Username:</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-800 font-bold">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password"
              className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          {errors.backend && <p className="text-red-500 text-sm mt-4">{errors.backend}</p>}
          <button type="submit" className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdmLogin;
