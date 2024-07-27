"use client"
import React, { useState } from "react"
import AdminNavbar from "../../components/admin/navbar";
import Sidebar from "../../components/admin/sidebar"
import AdminContent from "../../components/admin/content"

const Admin = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
      setSelectedItem(item);
    };

    return (
        <>
        <AdminNavbar />
        <div className="flex">
        <div className="w-1/4  bg-gradient-to-r from-slate-950 to-cyan-400 shadow-lg">
        <Sidebar onItemClick={handleItemClick} />
       
      </div>

      <div className="w-3/4 bg-gray-100 border-l-2 border-gray-300">
        <AdminContent selectedItem={selectedItem} />
      </div>
      </div>
        </>
    )
}

export default Admin