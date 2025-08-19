import Sidebar from './Sidebar'
import {Outlet} from 'react-router-dom'
import Navbar from './Navbar';



function Layout() {

  return (
    <>
    <div className=''>
    <div  className='flex justify-start items-start gap-4'>
        <Sidebar/>
        <Navbar/>
         
      
</div>
<div className='absolute left-[21%] top-[100px]'>
 <Outlet/>
 </div>
 
      
    </div>
    
     </>
  )
}

export default Layout
