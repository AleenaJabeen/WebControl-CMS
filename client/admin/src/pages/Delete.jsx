import React,{useState} from 'react'
import DeleteCareer from '../components/career/Delete';
import DeleteHome from '../components/home/Delete';
import DeleteLife from '../components/life/Delete';
import DeleteContact from '../components/contact/Delete';
import DeleteAbout from '../components/about/Delete';
import DeleteService from '../components/services/Delete';

function Delete() {
  const [activeForm, setActiveForm] = useState('home');
  
    const renderForm = () => {
      switch (activeForm) {
        case 'home':
          return <DeleteHome />;
        case 'career':
          return <DeleteCareer />;
        case 'about':
          return <DeleteAbout />;
         case 'services':
          return <DeleteService />;
         case 'contact':
          return <DeleteContact />;
         case 'life':
          return <DeleteLife />;
        default:
          return <p>Select a section to add data.</p>;
      }
    }
  return (
    <div className='flex flex-col space-x-3 mb-6'>
      <div className='bg-[#052c65] flex gap-6 text-white p-4 text-xl rounded '>
        <button onClick={() => setActiveForm('home')} className={`${activeForm==='home'?"bg-white text-[#052c65]":""} p-2 rounded`}>Home Data</button>
        <button onClick={() => setActiveForm('about')} className={`${activeForm==='about'?"bg-white text-[#052c65]":""} p-2 rounded`}>About Data</button>
         <button onClick={() => setActiveForm('services')}className={`${activeForm==='services'?"bg-white text-[#052c65]":""} p-2 rounded`}>Services Data</button>
          <button onClick={() => setActiveForm('life')} className={`${activeForm==='life'?"bg-white text-[#052c65]":""} p-2 rounded`}>Life Data</button>
           <button onClick={() => setActiveForm('career')} className={`${activeForm==='career'?"bg-white text-[#052c65]":""} p-2 rounded`}>Career Data</button>
           <button onClick={() => setActiveForm('contact')} className={`${activeForm==='contact'?"bg-white text-[#052c65]":""} p-2 rounded`}>Contact Data</button>
      </div>
      {renderForm()}
      
    </div>
  )
}

export default Delete
