import React from 'react'
import { CiSearch } from "react-icons/ci";
import { IoIosNotifications } from "react-icons/io";

function Navbar() {
  return (
    <div className='flex justify-between items-center w-screen p-6'>
        <div className='flex justify-between rounded-3xl border-gray-400 w-[50%] p-2 px-4 border items-center'><input className='w-full focus:outline-none' type="text" placeholder='Search'  /><CiSearch className='text-2xl' /></div>
        <div className='flex justify-center items-center gap-4'><IoIosNotifications className='text-2xl' /><div className='bg-[#052c65] text-white w-8 h-8 rounded-full flex justify-center items-center'>A</div></div>

      
    </div>
  )
}

export default Navbar
