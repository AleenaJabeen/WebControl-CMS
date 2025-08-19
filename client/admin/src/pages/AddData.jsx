import React,{useState,useContext} from 'react';
import { DataContext } from '../context/Context';
import AddCareer from '../components/career/Add';
import AddHome from '../components/home/Add';
import AddLife from '../components/life/Add';
import AddContact from '../components/contact/Add';
import AddAbout from '../components/about/Add';
import AddService from '../components/services/Add';

function AddData() {


  const [activeForm, setActiveForm] = useState('home');

  const renderForm = () => {
    switch (activeForm) {
      case 'home':
        return <AddHome/>;
      case 'career':
        return <AddCareer />;
      case 'about':
        return <AddAbout />;
       case 'services':
        return <AddService/>;
       case 'contact':
        return <AddContact />;
       case 'life':
        return <AddLife />;
      default:
        return <p>Select a section to add data.</p>;
    }
  }
  return (
   <div className="flex flex-col space-x-3 mb-6">
    <div className='bg-[#052c65] flex gap-6 text-white p-4 text-xl rounded '>
        <button onClick={() => setActiveForm('home')} className={`${activeForm==='home'?"bg-white text-[#052c65]":""} p-2 rounded`}>Home Data</button>
        <button onClick={() => setActiveForm('about')} className={`${activeForm==='about'?"bg-white text-[#052c65]":""} p-2 rounded`}>About Data</button>
         <button onClick={() => setActiveForm('services')}className={`${activeForm==='services'?"bg-white text-[#052c65]":""} p-2 rounded`}>Services Data</button>
          <button onClick={() => setActiveForm('life')} className={`${activeForm==='life'?"bg-white text-[#052c65]":""} p-2 rounded`}>Life Data</button>
           <button onClick={() => setActiveForm('career')} className={`${activeForm==='career'?"bg-white text-[#052c65]":""} p-2 rounded`}>Career Data</button>
           <button onClick={() => setActiveForm('contact')} className={`${activeForm==='contact'?"bg-white text-[#052c65]":""} p-2 rounded`}>Contact Data</button>
      </div>
{renderForm()}
{/* 
           <AdminFormData/> */}
           </div>
  )
}

export default AddData;
