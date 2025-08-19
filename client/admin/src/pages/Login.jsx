import React, { useState } from "react";
import { IoMdMail } from "react-icons/io";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SiPayloadcms } from "react-icons/si";



function Login() {
  const navigate=useNavigate();
  const [formdata, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((values) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const loginAdmin = async (formdata) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/login",
        formdata,{
            withCredentials: true 
        }
      );
       localStorage.setItem('accessToken', response.data.data.accessToken);
      localStorage.setItem('refreshToken', response.data.data.refreshToken); // Save JWT
      alert(response.data.message);
      navigate('/dashboard')
    } catch (error) {
      let status=error?.response?.status
      if (status === 404) {
        alert("User does not exist");
      } else if (status === 500) {
        alert("Server issue");
      }else if(status===400){
        alert("Password is incorrect")
      }
      // console.error("Error while registering",error)
    }
  };

  const inputValidations = (formdata) => {
    if (formdata.password === "" || formdata.email === "") {
      alert("All fields are required");
      return false;
    }else{
      return true;
    }
   
  };
  const handleLogin = (e) => {
    e.preventDefault();

    if (inputValidations(formdata)) {
      console.log("hello hehe")
      loginAdmin(formdata);
    }
  };
  return (
    <>
     <div className="flex flex-col justify-center items-center h-screen gap-4">
             <h1 className="lg:text-3xl text-2xl text-[#052c65] font-medium text-center">
            <div className="flex justify-center text-2xl font-bold py-6 gap-2 items-center">
                         <SiPayloadcms className="text-4xl" />
                        <span>WebControl CMS</span>
                       </div>
             </h1>
             <div className="bg-[#052c65] lg:w-[40%] w-[80%] lg:p-8 p-4 rounded-xl text-white">
              <h2 className="text-center text-4xl font-bold py-2">Login</h2>
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
               <div onClick={handleLogin} className="lg:w-[40%] w-full lg:mx-auto mx-0 flex justify-center items-center lg:text-2xl text-xl bg-white text-[#052c65] p-2 rounded-full font-medium cursor-pointer">
                 Login
               </div>
               <p className="text-xl text-white text-center pt-2">
                 Dont have an account?<Link to={"/register"}>Register now</Link>
               </p>
             </div>
           </div>
    </>
  );
}

export default Login;
