"use client";
import React, { useEffect, useState } from "react";
import { useAuthStore } from '../../store/store';


const AdminNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {  initialize, setAdminLogout } = useAuthStore();

  useEffect(() => {
    initialize(); 
  }, [initialize]);

  const handleLogout = async () => {
    setAdminLogout();
    window.location.href = "/adminlogin";
  };


  return (
    <nav className="bg-gradient-to-r from-gray-200 to-gray-300  shadow-xl">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/admlogo.png" className="h-24 w-24" alt="Logo" />
          </div>

          {/* Middle Menu Items */}
          <div className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-black">ADMIN PANEL</a>
            
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
                 
                      <button onClick={handleLogout} type="submit" className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign out
                      </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
