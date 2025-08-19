import React, { useState } from 'react';


 
const Memories= ({memories}) => {
    
    const [selectedCategory, setSelectedCategory] = useState();

if(!memories) return (<div>no memeories to show</div>)
  return (
    <div className='p-16'>
        <h3 className='text-sm font-bold text-center text-[#4aab3d]'>Our Memory</h3>
      <h1 className='text-center text-3xl font-bold mb-4'>Bitech Global, Capture Memories</h1>
       {/* Tabs */}
      <div className='flex justify-center items-center mt-4' style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        {memories.map((memory) => (
          <button
            key={memory._id}
            onClick={() => setSelectedCategory(memory)}
            style={{
              padding: '10px 20px',
              
              borderBottom:
                selectedCategory?._id === memory._id ? '3px solid green' : 'none',
                borderRadius:
                selectedCategory?._id === memory._id ? '0 20px' : 'none',
                 borderLeft:
                selectedCategory?._id === memory._id ? '1px solid green' : 'none',
                borderRight:
                selectedCategory?._id === memory._id ? '1px solid green' : 'none',
                borderTop:
                selectedCategory?._id === memory._id ? '1px solid green' : 'none',
              fontWeight:
                selectedCategory?._id === memory._id ? 'bold' : 'normal',
            }}
          >
            {memory.name}
          </button>
        ))}
      </div>

      {/* Images */}
      <div className='justify-center items-center' style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {selectedCategory?.images.map((img, index) => (
          <div key={index} style={{ width: '400px' }}>
            <img
              src={`http://localhost:8080${img}`}
              alt="images"
              style={{ width: '100%', borderRadius: '10px' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memories;
