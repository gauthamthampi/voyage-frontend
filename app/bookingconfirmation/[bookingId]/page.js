'use client'
import React from "react";
import Navbar from '../../../components/user/navbar'
import BookingConfirmation from "../../../components/user/bookingconfirmation/confirm";
import { useParams } from "next/navigation";


function BookingConfirmationPage() {

  const params = useParams()
  const {bookingId} = params

  return (
    <div>
        <Navbar />
        <BookingConfirmation bookingId={bookingId} />
      
    </div>
  )
}

export default BookingConfirmationPage
