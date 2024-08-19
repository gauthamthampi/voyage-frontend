"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from '../../store/store';
import { signOut } from 'next-auth/react'; // Import the signOut function from next-auth/react


const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { isLoggedIn, initialize, setLogout } = useAuthStore();

  useEffect(() => {
    initialize(); 
  }, [initialize]);

  const handleLogout = async () => {
    setLogout();
    await signOut({ redirect: false }); 
    window.location.href = "/login";
  };

  const handleSignIn = () => {
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gradient-to-r from-slate-950 to-cyan-400 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <a href="/"><img src="/images/logo.png" className="h-24 w-24" alt="Logo" /> </a>
          </div>

          <div className="hidden md:flex space-x-6">
            <a href="/exploredestination" className="text-gray-200 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out transform">DESTINATIONS</a>
            <a href="/explore" className="text-gray-200 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out transform">EXPLORE</a>
            <a href="/blogs" className="text-gray-200 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out transform">READ</a>
            <a href="#" className="text-gray-200 hover:text-white hover:scale-110 transition-transform duration-200 ease-in-out transform">PLAN</a>
          </div>

          {/* Dropdown */}
          <div className="relative inline-block text-left">
            <div>
              <button 
                type="button"
                className="inline-flex justify-center w-full rounded-md w-16 shadow-sm px-4 py-2 text-slate-950 hover:bg-gray-100 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                onClick={() => setDropdownOpen(!dropdownOpen)}>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
              </button>
            </div>

            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {isLoggedIn ? (
                    <>
                      <a href="/myprofile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                      <a href="/properties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Properties</a>
                      <button onClick={handleLogout} type="submit" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign out
                      </button>
                    </>
                  ) : (
                    <button onClick={handleSignIn} type="button" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Sign in
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
