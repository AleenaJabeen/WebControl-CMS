import React, { useEffect, useState } from "react";
import axios from "axios";

function Delete() {
  const [deleteImage, setDeleteImage] = useState(false);
const [deleteWhatsapp, setDeleteWhatsapp] = useState(false);
const [deleteOpenTime, setDeleteOpenTime] = useState(false);
  const [contact, setContact] = useState(null);
  const [selectedFields, setSelectedFields] = useState({
    socialLinks: [],
    fields: [],
    contactInfo: [],
  });
  const [dataId,setDataId]=useState();
  useEffect(() => {
    const fetchContact = async () => {
      const { data } = await axios.get("http://localhost:8080/api/v1/contact/read", {
        withCredentials: true,
      });
      setContact(data.data[0]);
      setDataId(data.data[0]._id)
    };
    fetchContact();
  }, []);


  const toggleSelect = (type, indexOrKey) => {
    setSelectedFields((prev) => {
      const list = prev[type];
      const updated = list.includes(indexOrKey)
        ? list.filter((item) => item !== indexOrKey)
        : [...list, indexOrKey];
      return { ...prev, [type]: updated };
    });
  };

  

const deleteSelected = async () => {

  const payload = {
    socialLinks: selectedFields.socialLinks,
    fields: selectedFields.fields,
    contactInfo: selectedFields.contactInfo,
    deleteContactImage: deleteImage,
    deleteWhatsappNumber: deleteWhatsapp,
    deleteOpenTime: deleteOpenTime,
    deleteImage: deleteImage,
  };

  try {
    await axios.patch(`http://localhost:8080/api/v1/contact/deleteOne/${dataId}`, payload, {
      withCredentials: true,
    });
    alert("Selected fields deleted!");
    window.location.reload();
  } catch (err) {
    alert("Error deleting fields");
    console.error(err);
  }
};


  const deleteAll = async () => {
    // const id = contact._id;
    console.log("data",dataId)
    if (!window.confirm("Are you sure you want to delete the entire contact document?")) return;
    await axios.delete(`http://localhost:8080/api/v1/contact/deleteAll/${dataId}`, {
      withCredentials: true,
    });
    alert("All contact data deleted!");
    setContact(null);
  };

  if (!contact) return <div>No contact data found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-[#052c65] font-bold mb-4">Delete Fields</h2>
      {contact.contactImage && (
  <div className="flex flex-col gap-2">
    <img
      src={`http://localhost:8080${contact.contactImage}`}
      alt="Contact"
      style={{ width: 120, height: "auto" }}
    />
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={deleteImage}
        onChange={() => setDeleteImage((prev) => !prev)}
      />
      <label className="text-red-600 font-medium">Delete Contact Image</label>
    </div>
  </div>
)}

<div className="mt-4 flex flex-col gap-2">
  {contact.whatsappNumber && (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={deleteWhatsapp}
        onChange={() => setDeleteWhatsapp((prev) => !prev)}
      />
      <label className="text-red-600 font-medium">Delete WhatsApp Number ({contact.whatsappNumber})</label>
    </div>
  )}

  {contact.openTime && (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={deleteOpenTime}
        onChange={() => setDeleteOpenTime((prev) => !prev)}
      />
      <label className="text-red-600 font-medium">Delete Open Time ({contact.openTime})</label>
    </div>
  )}
</div>

      <div>
        <h3 className="text-xl font-semibold text-[#052c65]">Social Links</h3>
        {contact.socialLinks.map((link, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={selectedFields.socialLinks.includes(idx)}
              onChange={() => toggleSelect("socialLinks", idx)}
            />
            <span>{link.platform} - {link.url}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold text-[#052c65]">Fields</h3>
        {contact.fields.map((field, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={selectedFields.fields.includes(idx)}
              onChange={() => toggleSelect("fields", idx)}
            />
            <span>{field.label} - {field.inputType}</span>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold text-[#052c65]">Contact Info</h3>
        {Object.entries(contact.contactInfo).map(([key, value]) => (
          <div key={key} className="flex gap-2 items-center">
            <input
              type="checkbox"
              checked={selectedFields.contactInfo.includes(key)}
              onChange={() => toggleSelect("contactInfo", key)}
            />
            <span>{key}: {value}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={deleteSelected} className="bg-red-600 text-white px-4 py-2 rounded">
          Delete Selected
        </button>
        <button onClick={deleteAll} className="bg-black text-white px-4 py-2 rounded">
          Delete Entire Document
        </button>
      </div>
    </div>
  );
}

export default Delete;
