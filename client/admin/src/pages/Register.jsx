import React,{useState} from "react";
import { IoMdMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from 'axios';
import { SiPayloadcms } from "react-icons/si";

function Register() {
    const [formdata,setFormData]=useState({
      username:"",
      email:"",
      password:""
    });

    const handleChange=(e)=>{
        setFormData(values=>({...values,[e.target.name]:e.target.value}));
    }

    const registerAdmin=async(formdata)=>{
try{
    const response=await axios.post('http://localhost:8080/api/v1/register',formdata)
        alert(response.data.message);

}catch(error)
      {
        if(error.status===409){
          alert('User already exists')
        }else if(error.status===500){
          alert("Server issue")
        }
        // console.error("Error while registering",error)
        
      }


    }

    const inputValidations=(formdata)=>{
      if(formdata.password==="" || formdata.username==="" || formdata.email==="" ){
        alert("All fields are required")
        return false
      }
      return true;

    }
    const handleRegister=(e)=>{
        e.preventDefault();
  
        if(inputValidations(formdata)){
  registerAdmin(formdata);
        }
      
       
    }
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen gap-4">
       <h1 className="lg:text-3xl text-2xl text-[#052c65]  font-medium text-center">
                   <div className="flex justify-center text-2xl font-bold py-6 gap-2 items-center">
                                <SiPayloadcms className="text-4xl" />
                               <span>WebControl CMS</span>
                              </div>
                    </h1>
        <div className="bg-[#052c65] lg:w-[40%] w-[80%] lg:p-8 p-4 rounded-xl text-white">
              <h2 className="text-center text-4xl font-bold py-2">Register</h2>  
          <div className="w-full flex items-end justify-start gap-4 lg:text-2xl text-xl  border-b-2 pb-2 mb-4">
            <FaUser />{" "}
            <input
              type="text"
              placeholder="Username"
              className="focus:outline-none"
              required
               name="username" 
              value={formdata.username} 
              onChange={handleChange}
            />
          </div>
          <div className="flex items-end justify-start gap-4 lg:text-2xl text-xl border-b-2 pb-2 mb-4">
            <IoMdMail />
            <input
              type="email"
              placeholder="Email"
              className="focus:outline-none"
              required
              name="email" 
              value={formdata.email} 
              onChange={handleChange}
            />
          </div>
          <div className="flex items-end justify-start lg:gap-4 gap-2 lg:text-2xl text-xl border-b-2 pb-2 mb-4">
            <RiLockPasswordFill />
            <input
              type="password"
              className="focus:outline-none"
              placeholder="Password"
              required
                name="password" 
                value={formdata.password} 
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-end p-4 cursor-pointer"></div>
          <div onClick={handleRegister} className="lg:w-[40%] w-full lg:mx-auto mx-0 flex justify-center items-center lg:text-2xl text-xl bg-white text-[#052c65] p-2 rounded-full font-medium cursor-pointer">
            Register
          </div>

          <p className="text-xl text-white text-center pt-2">
            Already have an account?<Link to={"/"}>Login now</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
