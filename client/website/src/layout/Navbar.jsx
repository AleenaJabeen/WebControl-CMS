import React from 'react'
import { Link ,useLocation} from 'react-router-dom';



function Navbar({header}) {
   const location = useLocation();
    if (!header) return null;
  return (
    <div className='flex justify-between items-center py-3 px-[6rem] fixed bg-white w-screen z-10 '>
        <div><img className='w-[129px] h-[50px] object-cover' src={`http://localhost:8080${header.logo}`} alt="Logo" /></div>
        <nav >
            <ul className='text-base text-[#000000A6] font-medium flex justify-center items-center gap-6'> 
            {header.navItems &&
        header.navItems.map((menu, index) => {
          const path =
            menu === "Home"
              ? "/"
              : "/" + menu.toLowerCase().replace(" ", "");

          const isActive = location.pathname === path;

          return (
            <Link to={path} key={index}>
              <li
                className={`${
                  isActive ? "text-[#4AAB3D] underline" : ""
                } hover:text-[#4AAB3D] hover:underline`}
              >
                {menu}
              </li>
            </Link>
          );
        })}
            </ul>
        </nav>
        <Link to={'/contact'} className='bg-[#4AAB3D] text-white p-2 px-4 rounded'>{header.rightBtn}</Link>
      
    </div>
  )
}

export default Navbar
