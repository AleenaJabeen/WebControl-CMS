import React from 'react'


function Jobs({jobs}) {
    if(!jobs) return (<div className='text-2xl text-center font-bold p-4'>No Jobs Opening at the moment</div>)
  return (
    <div className='grid grid-cols-3 gap-4 p-16'>
         {jobs.map((job)=>{
                return (<>
                <div className='flex flex-col text-white gap-6 p-6 bg-[#4aab3d] rounded'>
                    <h3 className='text-2xl font-semibold'>{job}</h3>
                  <button className='cursor-poiner text-white bg-blue-400 text-xl p-4 font-medium rounded'>Apply For job now</button>
                </div>
                </>)
            })}
      
    </div>
  )
}

export default Jobs
