import React from 'react'

function Tools({tools}) {
  return (
    <div>
        <h2 className='flex justify-center items-center text-base text-black font-bold gap-1'>OUR TOOLS <hr className='bg-blue-600 text-blue-500 text-2xl w-16 h-[1px] rounded' /></h2>
      <div className='grid grid-cols-4 gap-4 p-8'>
            {tools.tools.map((tool)=>{
                return (<>
                <div className='flex flex-col items-center justify-center gap-4 p-6'>
                    <div className='flex justify-center items-center w-24 h-24 rounded p-2'>
<img src={`http://localhost:8080${tool.toolImage}`} alt="Images" />
                    </div>
                    <h3 className='text-2xl text-black font-semibold'>{tool.tool}</h3>
                    <p className='text-base text-black text-center'>{tool.toolDescription}</p>
                </div>
                </>)
            })}

        </div>
    </div>
  )
}

export default Tools
