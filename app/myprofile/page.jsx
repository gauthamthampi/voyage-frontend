"use client"
import React, { useState } from "react"
import withAuth from "../../utils/withAuth.js"
import Navbar from "../../components/user/navbar.js"
import SidebarProfile from "../../components/user/myprofile/sidebar.js"
import Content from "../../components/user/myprofile/content.js"

const MyProfile = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
      setSelectedItem(item);
    };

    return (
        <>
        <Navbar />
        <h2 className=" m-7 font-sans text-2xl font-bold text-center">My Profile</h2>
        <div className="flex mx-20">
      <div className="w-1/4 bg-gray-100 ">
        <SidebarProfile onItemClick={handleItemClick} />
      </div>

      <div className="w-3/4 bg-gray-100 border-l-2 border-gray-300">
        <Content selectedItem={selectedItem} />
      </div>
      </div>
        </>

    )
}

export default withAuth(MyProfile);