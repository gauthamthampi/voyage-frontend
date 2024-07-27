"use client"
import React, { useState } from "react"
import withAuth from "../../utils/withAuth.js"
import Navbar from "../../components/user/navbar.js"
import SidebarProperties from "../../components/user/properties/sidebar.js"
import Content from "../../components/user/properties/content.js"

const MyProperties = () => {
    const [selectedItem, setSelectedItem] = useState(null);

    const handleItemClick = (item) => {
      setSelectedItem(item);
    };

    return (
        <>
        <Navbar />
        <h2 className=" m-7 font-sans text-2xl font-bold text-center">My Properties</h2>
        <div className="flex mx-20">
      <div className="w-1/4 bg-gray-100 ">
        <SidebarProperties onItemClick={handleItemClick} />
      </div>

      <div className="w-3/4 bg-gray-100 border-l-2 border-gray-300">
        <Content selectedItem={selectedItem} />
      </div>
      </div>
        </>

    )
}

export default withAuth(MyProperties);