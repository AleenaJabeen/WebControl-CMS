import React, { useState } from "react";
import { FaAlignLeft } from "react-icons/fa6";
import {useNavigate} from 'react-router-dom'
import { BsDatabaseFillDash } from "react-icons/bs";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { BsDatabaseFillUp } from "react-icons/bs";
import { SiPayloadcms } from "react-icons/si";
import axios from "axios";

function Sidebar() {
const [selectedComp,setSelectedComp]=useState("Dashboard");
const navigate=useNavigate();


const sidebarOptions=[
  {
    id:1,
    name:"Dashboard",
    icon:   <FaAlignLeft />,
    link:"/dashboard"
  },
  {
    id:2,
    name:"Create Data",
    icon:<BsDatabaseFillAdd />,
    link:"/dashboard/createData"
  }
  ,
  {
    id:3,
    name:"Update Data",
    icon:<BsDatabaseFillUp />,
    link:"/dashboard/updateData"
  },
  {
    id:4,
    name:"Delete Data",
    icon:<BsDatabaseFillDash />,
    link:"/dashboard/deleteData"
  }
  
]

const handleSidebar=(component,link)=>{
  setSelectedComp(component);
  navigate(link);


}

const handleLogout = async () => {
  try {
    await axios.post(
      "http://localhost:8080/api/v1/logout",
      {},
      {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      }
    );

    // Clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    navigate("/");
  } catch (err) {
    console.error("Logout failed:", err);
    // even if server fails, clear tokens locally
    localStorage.clear();
    navigate("/");
  }
};


  return (
    <div className="w-[22%] bg-[#052c65] min-h-[300vh] text-white">
      <div className="h-full">
        {/* logo */}
        <div className="flex justify-center text-2xl font-bold py-6 gap-2 items-center">
          <SiPayloadcms className="text-4xl" />
         <span>WebControl <br />CMS</span>
        </div>

        {/* all the other options */}
        <div className="flex flex-col justify-between items-center pt-4 backdrop-blur-3l">
          <div className="w-full flex flex-col p-4">

            {sidebarOptions.map((comp)=>{
              return (<div key={comp.id} className={`flex cursor-pointer rounded-md justify-start items-center gap-4 text-xl p-4 ${selectedComp===comp.name?"bg-white text-[#052c65]":""}`} onClick={()=>handleSidebar(comp.name,comp.link)}>
              {comp.icon}
              <h3>{comp.name}</h3>
            </div>);
            })}
            

            <div></div>
          </div>
          <div className="bg-white cursor-pointer rounded-md text-[#052c65] p-2 w-[50%]  text-center text-xl font-medium">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
