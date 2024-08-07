import React, { useState, useEffect } from "react";

// const BannerFront = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const images = [
//     "/images/banner_1.png",
//     "/images/banner_2.jpg",
//     "/images/banner_3.jpg"
//   ];

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
//     }, 7000); 
//     return () => clearInterval(interval);
//   }, []);

//   const handlePrev = () => {
//     setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
//   };

//   const handleNext = () => {
//     setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
//   };

//   return (
//     <div id="controls-carousel" className="relative w-full" data-carousel="static">
//       <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
//         {images.map((imgSrc, index) => (
//           <div key={index} className={`absolute w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ${activeIndex === index ? '' : 'hidden'}`} data-carousel-item={activeIndex === index ? 'active' : ''}>
//             <img src={imgSrc} className="block w-full" alt={`carousel-${index + 1}`} />
//           </div>
//         ))}
//       </div>
//       <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handlePrev}>
//         {/* Previous button content */}
//       </button>
//       <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handleNext}>
//         {/* Next button content */}
//       </button>
//     </div>
//   );
// };

import Image from 'next/image';

const BannerFront = () => {
  return (
    <section className="bg-gradient-to-r from-slate-950 to-cyan-400 shadow-lg">
      <div className="grid max-w-screen-xl px-4 pt-20 pb-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12 lg:pt-28">
        <div className="mr-auto place-self-center lg:col-span-7">
          <h1 className="max-w-2xl mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl xl:text-6xl text-white">
            Celebrate your  <br/>vacation with us.
          </h1>
          <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl ">
            This free and open-source landing page template was built using the utility classes from
            <a target="_blank" className="hover:underline">Tailwind CSS</a> and based on the
            components from the <a href="#/" className="hover:underline" target="_blank">Flowbite Library</a> and the
            <a href="https://flowbite.com/blocks/" target="_blank" className="hover:underline">Blocks System</a>.
          </p>
          
        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">
          {/* <img
            src="/images/admlogo.png" 
            className="w-full h-auto rounded-lg"
          /> */}
        </div>
      </div>
    </section>
  );
};


export default BannerFront;
