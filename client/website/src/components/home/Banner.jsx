import React, { useEffect, useState } from 'react';
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

const Banner = ({banner}) => {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

 
 useEffect(()=>{
    setSlides(banner);

 },[])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) return <div className="text-center p-10">Loading...</div>;

  const { imageUrl, heading, description,smallText } = slides[currentIndex];
if (!banner) return <div>Loading layout...</div>;
  return (
    
    <div className="relative w-full h-screen">
      <img src={`http://localhost:8080${imageUrl}`} alt={heading} className="w-full h-screen object-cover" />

      <div className="absolute inset-0 top-1/3 bg-opacity-20 w-[60%] flex flex-col jutify-start items-start text-white p-8">
        <h4 className='font-bold text-[#4aab3d]'>{smallText}</h4>
        <h2 className="text-5xl font-bold mb-4">{heading}</h2>
        <p className="text-lg">{description}</p>
        <div className='flex gap-4'>
      <button
        onClick={prevSlide}
         className="flex items-center gap-2 absolute top-1/2 left-4 p-2  transform -translate-y-1/2 bg-transparent text-white border-2 hover:border-none px-4 rounded-full shadow hover:bg-[#4AAb3D]"
      >
        <FaArrowLeft/>Previous
      </button>
      <button
        onClick={nextSlide}
        className="flex items-center gap-2 absolute top-1/2 left-36 p-2  transform -translate-y-1/2 bg-transparent text-white border-2 hover:border-none px-4 rounded-full shadow hover:bg-[#4AAb3D]"
      > 
    Next<FaArrowRight/>
      </button>
      </div>
      </div>


      {/* Navigation Buttons */}
      
    </div>
  );
};

export default Banner;
