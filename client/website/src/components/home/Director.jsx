import React from 'react'
import { FaQuoteLeft } from "react-icons/fa6";

function Director({director}) {
    if(!director) return (<div>Loading...</div>)
  return (
    <div className='flex p-8 items-stretch justify-center gap-6'> 
        <div className='flex flex-col gap-4 w-[50%] p-4'>
            <h4 className='text-base text-[#4aab3d] font-bold'>{director.directorText || "Director not found"}</h4>
        <h2 className='text-black text-[32px] font-bold'>{director.directorName || ""}</h2> 
        <p className='flex gap-2 text-base item-start'><FaQuoteLeft className='text-6xl text-[#4aab3d]' />{director.directorQuote || ""}</p>
        <img className='w-36' src={`http://localhost:8080${director.directorSignature}`}  alt="Signature" />
        <h4> {director.directorPosition || ""}</h4></div>
        <div className='h-auto w-[50%] p-4'><img src={`http://localhost:8080${director.directorImage || ""}`} className='h-full object-contain rounded' alt="Director Image" /></div>
      
    </div>
  )
}

export default Director
