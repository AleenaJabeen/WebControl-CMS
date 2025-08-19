import React, { useEffect, useState } from "react";
import axios from "axios";

function Update() {
  const [dataId,setDataId]=useState();
  const [form, setForm] = useState(null);
  const [previews, setPreviews] = useState({ contactImage: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      const { data } = await axios.get("http://localhost:8080/api/v1/contact/read", {
        withCredentials: true,
      });
      const contact = data.data[0];
      setDataId(data.data._id);
      console.log(contact)
      setForm(contact);
      setPreviews({ contactImage: contact.contactImage });
      setLoading(false);
    };
    fetchContact();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, contactImage: file }));
    setPreviews({ contactImage: URL.createObjectURL(file) });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldsChange = (index, key, value) => {
    const updated = [...form.fields];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, fields: updated }));
  };

  const handleSocialsChange = (index, key, value) => {
    const updated = [...form.socialLinks];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, socialLinks: updated }));
  };

  const handleContactInfoChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      contactInfo: { ...prev.contactInfo, [key]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    if (form.whatsappNumber) formData.append("whatsappNumber", form.whatsappNumber);
    if (form.openTime) formData.append("openTime", form.openTime);
    if (form.contactImage instanceof File) formData.append("contactImage", form.contactImage);
    if (form.contactInfo) formData.append("contactInfo", JSON.stringify(form.contactInfo));
    if (form.fields) formData.append("fields", JSON.stringify(form.fields));
    if (form.socialLinks) formData.append("socialLinks", JSON.stringify(form.socialLinks));

    try {
      const res = await axios.patch(`http://localhost:8080/api/v1/contact/update/${dataId}`, formData, {
        withCredentials: true,
      });
      alert("Contact info updated successfully!");
      console.log(res.data);
    } catch (error) {
      console.error("Update failed", error);
      alert("Update failed");
    }
  };

  if (loading || !form) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 p-4">
      <label className="bg-[#052c65] text-white text-xl p-2 rounded">
        Change Banner Image
        <input type="file" className="hidden" onChange={handleFileChange} />
      </label>
      
      {previews.contactImage && (
        <img src={`http://localhost:8080${previews.contactImage}`} alt="Preview" style={{ width: 120, height: "auto" }} />
      )} 
       {previews.contactImage && (
        <img src={`${previews.contactImage}`} alt="Preview" style={{ width: 120, height: "auto" }} />
      )}
      <div className="flex gap-4">
<label className='text-[#052c65] bg-white text-xl rounded'>
            Whatsapp Number:
          </label>
      <input
        name="whatsappNumber"
        value={form.whatsappNumber}
        onChange={handleInputChange}
        className="border p-2 rounded"
        placeholder="WhatsApp Number"
      />
      <label className='text-[#052c65] bg-white text-xl rounded'>
            Open Time:
          </label>
      <input
        name="openTime"
        value={form.openTime}
        onChange={handleInputChange}
        className="border p-2 rounded"
        placeholder="Open Time"
      />
      </div>

      <h3 className="text-[#052c65] text-xl">Contact Info</h3>
      <div className="flex gap-2">
       <input
        value={form.contactInfo.address}
        onChange={(e) => handleContactInfoChange("address", e.target.value)}
        className="border p-2 rounded"
        placeholder="Address"
      /> 
      <input
        value={form.contactInfo.phone}
        onChange={(e) => handleContactInfoChange("phone", e.target.value)}
        className="border p-2 rounded"
        placeholder="Phone"
      />
      <input
        value={form.contactInfo.email}
        onChange={(e) => handleContactInfoChange("email", e.target.value)}
        className="border p-2 rounded"
        placeholder="Email"
      />
      </div>

      <h3 className="text-[#052c65] text-xl">Social Links</h3>
      {form.socialLinks.map((link, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            value={link.platform}
            onChange={(e) => handleSocialsChange(idx, "platform", e.target.value)}
            className="border p-2 rounded"
            placeholder="Platform"
          />
          <input
            value={link.url}
            onChange={(e) => handleSocialsChange(idx, "url", e.target.value)}
            className="border p-2 rounded"
            placeholder="URL"
          />
        </div>
      ))}

      <h3 className="text-[#052c65] text-xl">Fields</h3>
      {form.fields.map((field, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            value={field.label}
            onChange={(e) => handleFieldsChange(idx, "label", e.target.value)}
            className="border p-2 rounded"
            placeholder="Label"
          />
          <input
            value={field.inputType}
            onChange={(e) => handleFieldsChange(idx, "inputType", e.target.value)}
            className="border p-2 rounded"
            placeholder="Input Type"
          />
        </div>
      ))}

      <button type="submit" className="bg-[#052c65] text-white p-2 rounded self-center">
        Update Contact Info
      </button>
    </form>
  );
}

export default Update;
