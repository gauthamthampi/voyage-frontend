"use client";
import React, { useState, useEffect } from "react";
import withAuth from "../../utils/withAuth.js";
import Navbar from "../../components/user/navbar.js";
import SidebarProperties from "../../components/user/properties/sidebar.js";
import Content from "../../components/user/properties/content.js";
import axiosInstance from "@/utils/axios.js";
import getEmailFromToken from "@/utils/decode.js";
import { localhost } from "@/url.js";

const MyProperties = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPremium, setIsPremium] = useState(true); // Assume premium initially to prevent flicker
  const [showModal, setShowModal] = useState(false);

  const userEmail = getEmailFromToken()

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const response = await axiosInstance.get(`${localhost}/user/getuser?email=${userEmail}`);
          setIsPremium(response.data.premium);
          if (!response.data.premium) {
            setShowModal(true);
          
        }
      } catch (error) {
        console.error("Failed to check premium status:", error);
      }
    };

    checkPremiumStatus();
  }, [userEmail]);

  if (showModal) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Access Denied</h2>
          <p className="mb-4 text-center">
            You need to be a premium member to access the premium panel. <br />
            To take a subscription, go to My Profile &gt; Subscription &gt; Get Subscription.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Go to Home
            </button>
            <button
              onClick={() => (window.location.href = "/myprofile")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              My Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <h2 className="m-7 font-sans text-2xl font-bold text-center">Premium Panel</h2>
      <div className="flex mx-20">
        <div className="w-1/4 bg-gray-100">
          <SidebarProperties onItemClick={handleItemClick} />
        </div>
        <div className="w-3/4 bg-gray-100 border-l-2 border-gray-300">
          <Content selectedItem={selectedItem} />
        </div>
      </div>
    </>
  );
};

export default withAuth(MyProperties);
