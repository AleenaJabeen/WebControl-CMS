import React,{useState} from "react";
import { IoMdAddCircle } from "react-icons/io";
import axios from "axios";

function Add() {
  const [form, setForm] = useState({
    openTime: "",
    whatsappNumber: "",
    contactImage: null,
    socialLinks: [{ platform: "", url: "" }],
    fields: [{ label: "", inputType: "" }],
    contactInfo: { email: "", address: "", phone: "" },
  });

  const [previews, setPreviews] = useState({
    contactImage: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, [name]: file }));
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [name]: previewUrl }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldsChange = (index, key, value) => {
    const updatedFields = [...form.fields];
    updatedFields[index] = {
      ...updatedFields[index],
      [key]: value,
    };
    setForm((prev) => ({ ...prev, fields: updatedFields }));
  };
  const handleSocialsChange = (index, key, value) => {
    const updatedSocials = [...form.socialLinks];
    updatedSocials[index] = {
      ...updatedSocials[index],
      [key]: value,
    };
    setForm((prev) => ({ ...prev, socialLinks: updatedSocials }));
  };

  const addSocials = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "" }],
    }));
  };

  const addFields = () => {
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, { label: "", inputType: "" }],
    }));
  };
  // const removeField = (index) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     fields: prev.fields.filter((_, i) => i !== index),
  //   }));
  // };
  // const removeSocials = (index) => {
  //   setForm((prev) => ({
  //     ...prev,
  //     fields: prev.socialLinks.filter((_, i) => i !== index),
  //   }));
  // };
  const handleContactInfoChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [key]: value,
      },
    }));
  };
  const inputValidate = (form) => {
    if (
      form.whatsappNumber === "" ||
      form.fields.length === 0 ||
      form.openTime === "" ||
      Object.keys(form.contactInfo).length === 0 ||
      form.socialLinks.length === 0
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    if (inputValidate(form)) {
      const formData = new FormData();
      formData.append("whatsappNumber", form.whatsappNumber);
      formData.append("openTime", form.openTime);
      formData.append("contactImage", form.contactImage);
      formData.append("contactInfo", JSON.stringify(form.contactInfo));
      formData.append("socialLinks", JSON.stringify(form.socialLinks));
      formData.append("fields", JSON.stringify(form.fields));

      const response = await axios.post(
        "http://localhost:8080/api/v1/contact/create",
        formData,
        {
          withCredentials: true,
        }
      );
      console.log("response", response.data.data._id);

      alert("Settings saved!");
    } else {
      alert("All fields are required");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 p-4">
        <div className='flex gap-2'>
      <label className='bg-[#052c65] text-white text-xl p-2 rounded'>
        Select Contact Banner Image
        <input name="contactImage" type="file" onChange={handleFileChange} className='hidden' />
      </label>
     {previews.contactImage && (
  <img src={previews.contactImage} alt="Contact Image Preview" style={{ width: 100, height: 'auto', marginTop: 10 }} />
)}
</div>
        <div className="flex gap-4 items-center">
          <label className='text-[#052c65] bg-white text-xl rounded'>
            Whatsapp Number:
          </label>
           <input
              name="whatsappNumber"
              value={form.whatsappNumber}
              onChange={handleInputChange}
              placeholder="Number"
              className="bg-white border rounded p-2"
            />
          <label className='text-[#052c65] bg-white text-xl p-2 rounded' >
            Open Time:
          </label>
          <input
              name="openTime"
              value={form.openTime}
              onChange={handleInputChange}
              placeholder="Number"
              className="bg-white border rounded p-2"
            />
        </div>
   <h3 className='text-[#052c65] text-xl font-semibold'>Contact Info</h3>
        <div className="flex gap-6">
       
          <label>
            Address:
          <input
  type="text"
  value={form.contactInfo.address}
  onChange={(e) => handleContactInfoChange("address", e.target.value)}
  className='p-2 border border-gray-400 m-2 rounded'
/>
</label>
<label>
  Phone:

<input
  type="text"
  value={form.contactInfo.phone}
  onChange={(e) => handleContactInfoChange("phone", e.target.value)}
  className='p-2 border border-gray-400 m-2 rounded'
/>
</label>
<label>
  Email:
<input
  type="email"
  value={form.contactInfo.email}
  onChange={(e) => handleContactInfoChange("email", e.target.value)}
  className='p-2 border border-gray-400 m-2 rounded'
/>
</label>

        </div>
<div>
        <div>
              <h3 className='text-[#052c65] text-xl font-semibold'>Social Links</h3>
              {form.socialLinks.map((item, idx) => (
                <div key={idx} className="flex gap-4 my-2">
                  <input
                  className='p-2 border border-gray-400 mb-2 rounded'
                    placeholder="Platform"
                   value={item.platform}
        onChange={(e) => handleSocialsChange(idx,"platform", e.target.value)}
                  />
                   <input
                  className='p-2 border border-gray-400 mb-2 rounded'
                    placeholder="Url"
                   value={item.url}
        onChange={(e) => handleSocialsChange(idx,"url", e.target.value)}
                  />
                  
                </div>
              ))}
              <button type="button" onClick={addSocials} className='text-white rounded bg-[#052c65] p-2 text-xl flex items-center gap-2'><IoMdAddCircle />Add Social Links</button>
        </div>
         <div className="my-2">
              <h3 className='text-[#052c65] text-xl font-semibold'>Fields</h3>
              {form.fields.map((item, idx) => (
                <div key={idx} className="flex gap-4 my-2">
                  <input
                  className='p-2 border border-gray-400 mb-2 rounded'
                    placeholder="Label"
                   value={item.label}
        onChange={(e) => handleFieldsChange(idx,"label", e.target.value)}
                  />
                   <input
                  className='p-2 border border-gray-400 mb-2 rounded'
                    placeholder="Input Type"
                   value={item.inputType}
        onChange={(e) => handleFieldsChange(idx,"inputType", e.target.value)}
                  />
                  
                </div>
              ))}
              <button type="button" onClick={addFields} className='text-white rounded bg-[#052c65] p-2 text-xl flex items-center gap-2'><IoMdAddCircle />Add Social Links</button>
        </div>
        </div>
              <button type="submit" className='cursor-pointer bg-[#052c65] p-2 text-xl text-white rounded self-center'>Create Data</button>
      </form>
    </>
  );
}

export default Add;
