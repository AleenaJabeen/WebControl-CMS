import React from 'react'

function Partner({partner}) {
  return (
    <div className='flex gap-4 p-10 justify-between w-full'>
        <div className='w-[50%] flex flex-col gap-4'>
            <p>OUR PARTNER</p>
            <h2 className='text-4xl font-bold'>{partner.header}</h2>
            <p className='text-base text-gray-500'>{partner.description}</p>
            </div>
        <div className='flex w-[50%] gap-2 rounded p-4'>
            {partner.images.map((image,index)=>{
                return (
                 <img key={index} src={`http://localhost:8080${image}`} className='w-36' alt="image" />
                );

            })
        }
           
        </div>
      
    </div>
  )
}

export default Partner
