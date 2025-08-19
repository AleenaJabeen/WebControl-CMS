import React from 'react'

function CareerForm({careerForm}) {
    if(!careerForm) return (<div>No data</div>)
       

  return (
    <div className='p-26'> 
      <form>
        <h2 className='text-2xl font-bold'>Apply Now</h2>
        <div className='flex flex-col w-full text-xl gap-2' >
        {careerForm.map((fields)=>{
            return (
                <>
                {fields.inputType==="textarea"?<>
                <label>{fields.label}</label>
                <textarea className='border-gray-500 border rounded mt-2 py-4 px-2' placeholder={fields.label}></textarea>
               
                </>:<>
                 <label> {fields.label}</label>
               
                 <input type={fields.inputType}className='border-gray-500 border rounded mt-2 p-2'placeholder={fields.label} /></>}
                </>
            )
        })}
        </div>
        <button type='submit' className='rounded bg-[#4aab3d] p-4 mt-4 text-white'>Submit Application</button>

      </form>

      
    </div>
  )
}

export default CareerForm
