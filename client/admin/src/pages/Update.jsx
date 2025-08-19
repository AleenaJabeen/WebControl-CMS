import React,{useState} from 'react'
import UpdateCareer from '../components/career/Update';
import UpdateHome from '../components/home/Update';
import UpdateLife from '../components/life/Update';
import UpdateContact from '../components/contact/Update';
import UpdateAbout from '../components/about/Update';
import UpdateService from '../components/services/Update';
function Update() {
  const [activeForm, setActiveForm] = useState('home');
  
    const renderForm = () => {
      switch (activeForm) {
        case 'home':
          return <UpdateHome />;
        case 'career':
          return <UpdateCareer />;
        case 'about':
          return <UpdateAbout />;
         case 'services':
          return <UpdateService/>;
         case 'contact':
          return <UpdateContact />;
         case 'life':
          return <UpdateLife />;
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

export default Update;
