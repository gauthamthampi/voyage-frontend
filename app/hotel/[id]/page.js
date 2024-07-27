'use client';
import Navbar from "@/components/user/navbar";
import HotelDetail from '@/components/user/hoteldetails/detail'
import { useParams } from 'next/navigation';

// Component
const HotelDetailPage = () => {
    const params = useParams()
    const {id} = params
    return (
    <>
    < Navbar />
    < HotelDetail id={id}/>
    </>
    )
}
export default HotelDetailPage;
