import React from 'react'

function Banner({banner,text}) {
  if(!banner) return (<div>No data</div>)
  return (
    <div className='w-full h-full'>
        <img src={`http://localhost:8080${banner}`} className='bg-opacity-20 h-82 w-screen' alt="BannerImage" />
        <div className='absolute top-1/3 left-1/2 text-white '>
            <h3>Home | {text}</h3>
        </div>
      
    </div>
  )
}

export default Banner
