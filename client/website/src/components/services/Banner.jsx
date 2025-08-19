import React from 'react'

function Banner({banner}) {
  if(!banner) return (<div>No data</div>)
  return (
    <div className='w-full h-full mt-10'>
        <img src={`http://localhost:8080${banner}`} className='bg-opacity-20 h-72 object-cover w-screen' alt="BannerImage" />
        <div className='absolute top-1/3 left-1/2 text-white '>
            <h3>Home | Services</h3>
        </div>
      
    </div>
  )
}

export default Banner
