'use client';
import Navbar from "@/components/user/navbar";
import HotelDetail from '@/components/user/hoteldetails/detail'
import { useParams } from 'next/navigation';
import Footer from "@/components/user/footer";

// Component
const HotelDetailPage = () => {
    const params = useParams()
    const {id} = params
    return (
    <>
    < Navbar />
    < HotelDetail id={id}/>
    <Footer />
    </>
    )
}
export default HotelDetailPage;
