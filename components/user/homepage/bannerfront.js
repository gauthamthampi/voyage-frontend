import React, { useState, useEffect } from "react";

const BannerFront = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const images = [
    "/images/banner_1.png",
    "/images/banner_2.jpg",
    "/images/banner_3.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000); 
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div id="controls-carousel" className="relative w-full" data-carousel="static">
      <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
        {images.map((imgSrc, index) => (
          <div key={index} className={`absolute w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 ${activeIndex === index ? '' : 'hidden'}`} data-carousel-item={activeIndex === index ? 'active' : ''}>
            <img src={imgSrc} className="block w-full" alt={`carousel-${index + 1}`} />
          </div>
        ))}
      </div>
      <button type="button" className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handlePrev}>
        {/* Previous button content */}
      </button>
      <button type="button" className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" onClick={handleNext}>
        {/* Next button content */}
      </button>
    </div>
  );
};

export default BannerFront;
