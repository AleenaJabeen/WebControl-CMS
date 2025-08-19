import React from 'react'

function Products({services}) {
    if(!services) return (<div>No services available</div>)
  return (
    <div className='flex flex-col gap-4 p-8'>
        <div className='flex flex-col gap-2 p-8'> 
            <h3 className='text-sm text-[#4aab3d] font-bold'>OUR SERVICES</h3>
            <h2 className='text-3xl text-black font-bold'>{services.header}</h2>
            <p className='text-black text-base'>{services.description}</p>
        </div>
        <div className='grid grid-cols-2 gap-4 p-8'>
            {services.services.map((service)=>{
                return (<>
                <div className='flex flex-col gap-4 p-6'>
                    <div className='flex justify-center items-center w-16 h-16 rounded bg-green-200 p-2'>
<img src={`http://localhost:8080${service.image}`} alt="Images" />
                    </div>
                    <h3 className='text-2xl text-black font-semibold'>{service.service}</h3>
                    <p className='text-base text-black'>{service.serviceDescription}</p>
                </div>
                </>)
            })}

        </div>

      
    </div>
  )
}

export default Products
