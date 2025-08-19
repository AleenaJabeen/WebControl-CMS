import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { IoIosArrowForward } from "react-icons/io";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";

function Footer({footer}) {
    const platformIcons = {
  facebook: <FaFacebookF />,
  instagram: <FaInstagram />,
  twitter: <FaTwitter />,
  linkdein: <FaLinkedinIn />,
};

    console.log(footer)
     if (!footer) return null;
  return (
    <div className='flex flex-col relative mt-16'>
        <div className='w-[80%] absolute bg-[#4AAB3D] text-4xl font-medium text-center text-white p-12 top-[-3rem] left-[10%] mx-auto rounded-md'><h2>"{footer.companyMotto}"</h2></div>
        <div className='flex justify-evenly p-4 text-white bg-[#212529] gap-4 items-start px-18 py-10 pt-[8rem]'>
            <div className='flex flex-col gap-2 w-[20%]'>
                <img src={`http://localhost:8080${footer.logoUrl}`} alt="footer logo"  className='w-24'/>
                <p className='text-[15px]'>{footer.footerDescription}</p>
                <div className='flex gap-4'>{footer.socialLinks && footer.socialLinks.map((link)=>{
                    return(
                    <Link to={link.url} className='text-white'> {platformIcons[link.platform] || link.platform}</Link>
                    )
                })}</div>
            </div>
            <div>
                <h3 className='font-bold text-xl pb-2'>Useful Links</h3>
                 <div className='flex flex-col '>{footer.usefulLinks && footer.usefulLinks.map((link)=>{
                    return(
                    <Link className='flex items-center text-[15px]'> <IoIosArrowForward />{link.label}</Link>
                    )
                })}</div>

            </div>
            <div>
                <h3 className='font-bold text-xl pb-2'>Our Services</h3>
                 <div className='flex flex-col '><ul>
                    {footer.services && footer.services.map((service)=>{
                    return(
                    <li className='flex items-center text-[15px]'> <IoIosArrowForward />{service}</li>
                    )
                })}
                </ul></div>

            </div>
            <div className='w-[20%] flex flex-col gap-2'>
                <h3 className='font-bold text-xl pb-2 '>Contact Us</h3>
                
                <h4 className='flex gap-2 text-[15px] items-start'><FaMapMarkerAlt className='text-3xl' />{footer.contactInfo.address}</h4>
                <h4 className='flex gap-2 text-[15px] items-start'><FaWhatsapp className='text-xl' />{footer.contactInfo.phone}</h4>
                <h4 className='flex gap-2 text-[15px] items-start'><IoMdMail  className='text-xl'/>{footer.contactInfo.email}</h4>
            </div>
        </div>
        <div className='bg-[#121212] text-white p-4 text-sm'><h4 className='text-center'>© 2017-2027 Bitech Pvt Ltd. All Rights Reserved.</h4></div>
      
    </div>
  )
}

export default Footer
