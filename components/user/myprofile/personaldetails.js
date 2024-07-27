import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../../store/store';
import Modal from './modal';
import FormField from './formfield';
import { format } from 'date-fns';
import { localhost } from '../../../url';
import getEmailFromToken from '../../../utils/decode';

const PersonalDetails = () => {
  const [userDetails, setUserDetails] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [profilePic, setProfilePic] = useState('');
  const setloggedEmail = useAuthStore(state => state.setloggedEmail);
  const fileInputRef = useRef(null);
  const userEmail = getEmailFromToken();

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userEmail) {
        try {
          const response = await axios.get(`${localhost}/user/getuser?email=${userEmail}`);
          setUserDetails(response.data);
          setProfilePic(response.data.profilePic || ''); 
        } catch (error) {
          console.error('There was a problem with the axios operation:', error);
        }
      }
    };

    fetchUserDetails();
  }, [setloggedEmail, userEmail]);

  useEffect(() => {
    const fetchCountryList = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countries = response.data.map(country => country.name.common);
        setCountryList(countries.sort());
      } catch (error) {
        console.error('Error fetching country list:', error);
      }
    };

    fetchCountryList();
  }, []);

  const openModal = (field) => {
    setEditField(field);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditField('');
  };

  const handleSave = async (updatedValue) => {
    const token = localStorage.getItem('usertoken');
    const decodedToken = jwtDecode(token);
    const userEmail = decodedToken.email;

    try {
      const requestBody = { email: userEmail, [editField]: updatedValue };
      const response = await axios.put(`${localhost}/user/updateuser`, requestBody);
      setUserDetails(response.data);
      if (editField === 'profilePic') {
        setProfilePic(updatedValue);
      }
    } catch (error) {
      console.error('There was a problem with the axios operation:', error);
    }

    closeModal();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return format(date, 'MMMM dd, yyyy'); 
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('profilePic', file);
    formData.append('email', userEmail);
    console.log(userEmail);
    try {
      const response = await axios.put(`${localhost}/user/uploadprofilepic`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUserDetails(response.data);
      setProfilePic(response.data.profilePic);
    } catch (error) {
      console.error('Error uploading profile picture:', error);
    }
  };

  

  return (
    <>
      <div className='p-2 border-b-2 flex justify-between items-center'>
        <div>
          <p className='px-6 pt-3 text-lg font-bold'>Personal Details</p>
          <p className='px-6 text-sm font-light'>Update your information and find out how it's used.</p>
        </div>
        <div className='relative'>
          <img
            src={profilePic || '/images/defaultdp.jpg'}
            alt='Profile'
            className='w-16 h-16 rounded-full object-cover'
          />
        <button className='absolute bottom-0 right-0 bg-blue-700 text-white rounded-full p-1'>
  <label htmlFor='profilePicUpload' className='cursor-pointer'>
    +
  </label>
  <input
    type='file'
    id='profilePicUpload'
    accept='image/*'
    className='hidden'
    onChange={handleProfilePicUpload}
  />
</button>
        </div>
      </div>
      <div className="flex justify-between items-center p-3 text-base border-b-2">
        <p className="flex-1 px-6">Firstname</p>
        <p className="flex-1 text-center">{userDetails.name}</p>
        <p className="flex-1 text-right text-blue-700 cursor-pointer" onClick={() => openModal('name')}>
          {userDetails.name ? 'Edit' : 'Add'}
        </p>
      </div>
      <div className="flex justify-between items-center p-3 text-base border-b-2">
        <p className="flex-1 px-6">Mobile</p>
        <p className="flex-1 text-center">{userDetails.mobile}</p>
        <p className="flex-1 text-right text-blue-700 cursor-pointer" onClick={() => openModal('mobile')}>
          {userDetails.mobile ? 'Edit' : 'Add'}
        </p>
      </div>
      <div className="flex justify-between items-center p-3 text-base border-b-2">
        <p className="flex-1 px-6">Email</p>
        <p className="flex-1 text-center">{userDetails.email}</p>
        <p className="flex-1 text-right text-blue-700 cursor-pointer"></p>
      </div>
      <div className="flex justify-between items-center p-3 text-base border-b-2">
        <p className="flex-1 px-6">Date of Birth</p>
        <p className="flex-1 text-center">{formatDate(userDetails.dob)}</p>
        <p className="flex-1 text-right text-blue-700 cursor-pointer" onClick={() => openModal('dob')}>
          {userDetails.dob ? 'Edit' : 'Add'}
        </p>
      </div>
      <div className="flex justify-between items-center p-3 text-base border-b-2">
        <p className="flex-1 px-6">Nationality</p>
        <p className="flex-1 text-center">{userDetails.nationality}</p>
        <p className="flex-1 text-right text-blue-700 cursor-pointer" onClick={() => openModal('nationality')}>
          {userDetails.nationality ? 'Edit' : 'Add'}
        </p>
      </div>
      <div className="flex justify-between items-center p-3 text-base border-b-2">
        <p className="flex-1 px-6">Gender</p>
        <p className="flex-1 text-center">{userDetails.gender}</p>
        <p className="flex-1 text-right text-blue-700 cursor-pointer" onClick={() => openModal('gender')}>
          {userDetails.gender ? 'Edit' : 'Add'}
        </p>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <FormField
            field={editField}
            value={userDetails[editField]}
            onSave={handleSave}
            countryList={countryList} 
          />
        </Modal>
      )}
    </>
  );
};

export default PersonalDetails;
