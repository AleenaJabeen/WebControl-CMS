import React, { useEffect, useState } from "react";
import axios from "axios";
import Banner from "../about/Banner";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { Link } from "react-router-dom";

function Contact() {
  const platformIcons = {
    facebook: <FaFacebookF />,
    instagram: <FaInstagram />,
    twitter: <FaTwitter />,
    linkedin: <FaLinkedinIn />,
  };
  const [data, setData] = useState(null);
  const [banner, setBanner] = useState(null);
  const [contact, setContact] = useState();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/contact/read"
        );
        const data = response.data.data[0];
        console.log(data);
        setBanner(data.contactImage);
        setContact(data.contactInfo);
        setData(data);
      } catch (error) {
        console.error("Error fetching layout data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
  if (loading) return <div>Loading layout...</div>;

  return (
    <div>
      <Banner banner={banner} text="Contact" />
      <h3 className="text-center font-bold text-[#4aab3d] text-sm p-4">
        Contact Us
      </h3>
      <h2 className="text-3xl text-center font-bold text-black p-4">
        Get in Touch with Us
      </h2>
      <div className="flex items-stretch justify-center gap-6 p-16">
        <div className="w-[40%] h-auto  rounded-md bg-[#121212] text-white text-base p-4">
          <div className=" flex flex-col gap-4 h-full p-4">
            <h4 className="text-base font-bold">Address</h4>
            <h4 className="flex gap-2 text-[15px] items-start">
              <FaMapMarkerAlt className="text-3xl" />
              {contact.address}
            </h4>
            <h4 className="text-base font-bold">Contact</h4>
            <h4 className="flex gap-2 text-[15px] items-start">
              <FaWhatsapp className="text-xl" />
              {contact.phone}
            </h4>
            <h4 className="flex gap-2 text-[15px] items-start">
              <IoMdMail className="text-xl" />
              {contact.email}
            </h4>
            <h4 className="text-base font-bold">Open time</h4>
            <h4 className="flex gap-2 text-[15px] items-start">
              {data.openTime}
            </h4>
            <h4 className="text-base font-bold">Follow us</h4>

            <div className="flex gap-4">
              {data.socialLinks &&
                data.socialLinks.map((link) => {
                  return (
                    <Link
                      to={link.url}
                      className="text-white w-8 h-8 rounded-full bg-[#4aab3d] flex justify-center items-center"
                    >
                      {" "}
                      {platformIcons[link.platform] || link.platform}
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>

        <div className="w-[70%] p-8">
          <form className="">
            <h2 className="text-2xl font-bold">Apply Now</h2>
            <div className="flex flex-col  text-xl gap-2">
              {data.fields.map((field) => {
                return (
                  <>
                 
                    {field.inputType === "textarea" ? (
                      <>
                      <div className="flex gap-2 items-center">
                        <label>{field.label}</label>
                        <textarea
                          className="border-gray-500 border rounded mt-2 py-4 px-2"
                          placeholder={field.label}
                        ></textarea>
                        </div>
                      </>
                    ) : (
                      <>
                      <div className="flex gap-2 items-center">
                        <label> {field.label}</label>

                        <input
                          type={field.inputType}
                          className="border-gray-500 border rounded mt-2 p-2"
                          placeholder={field.label}
                        />
                        </div>
                      </>
                    )}
                  
                  </>
                );
              })}
            </div>
            <button
              type="submit"
              className="rounded bg-black text-xl p-2 mt-4 text-white"
            >
              Send Your Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
