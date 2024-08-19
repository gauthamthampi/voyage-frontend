"use client"
import Navbar from "../components/user/navbar.js";
import BannerFront from "../components/user/homepage/bannerfront.js";
import { useSession,signIn } from "next-auth/react";
import React, { useState,useEffect } from 'react';
import { useAuthStore } from "../store/store.js";
import Footer from "../components/user/footer.js"
import MiddleBanner from '../components/user/homepage/middlebanner.js'
import TrendingDestinations from '../components/user/homepage/row1.js'
import PropertySugg from '../components/user/homepage/row2.js'


const Home = () => {
  const { data: session } = useSession();
  const setLogin = useAuthStore((state) => state.setLogin);


  useEffect(() => {
    if (session?.accessToken) {
      setLogin(session.accessToken);
      // window.location.href = "/"
    }
  }, [session, setLogin]);

  return (
    <>
      <Navbar />
      <BannerFront />
      <TrendingDestinations />
      <PropertySugg />
      <MiddleBanner />
      <Footer />
    </>
  );
};

export default Home;
