import React, { useEffect, useState } from "react";
import axios from "axios";

function Delete() {
  const [deleteImage, setDeleteImage] = useState(false);
const [deleteHeader, setDeleteHeader] = useState(false);
const [deleteToolHeading, setDeleteToolHeading] = useState(false);
const [deleteServicesDescription, setDeleteServicesDescription] = useState(false);
const [selectedToolIndexes, setSelectedToolIndexes] = useState([]);
const [selectedServiceIndexes, setSelectedServiceIndexes] = useState([])
  const [service, setService] = useState(null);
  const [dataId,setDataId]=useState();
  useEffect(() => {
    const fetchService= async () => {
      const { data } = await axios.get("http://localhost:8080/api/v1/service/read", {
        withCredentials: true,
      });
      setService(data.data[0]);
      setDataId(data.data[0]._id)
    };
    fetchService();
  }, []);

const toggleIndex = (type, index) => {
  if (type === "tool") {
    setSelectedToolIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  } else if (type === "service") {
    setSelectedServiceIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }
};

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
  deleteServiceImage: deleteImage,
  deleteServiceHeader: deleteHeader,
  deleteServicesDescription: deleteServicesDescription,
  deleteToolHeading: deleteToolHeading,
  deleteToolsIndexes: selectedToolIndexes,
  deleteServicesIndexes: selectedServiceIndexes,
};


  try {
    await axios.patch(`http://localhost:8080/api/v1/service/deleteOne/${dataId}`, payload, {
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
    await axios.delete(`http://localhost:8080/api/v1/service/deleteAll/${dataId}`, {
      withCredentials: true,
    });
    alert("All contact data deleted!");
    setService(null);
  };

  if (!service) return <div>No contact data found</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl text-[#052c65] font-bold mb-4">Delete Fields</h2>
      {service.serviceImage && (
  <div className="flex flex-col gap-2">
    <img
      src={`http://localhost:8080${service.serviceImage}`}
      alt="Service"
      style={{ width: 120, height: "auto" }}
    />
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={deleteImage}
        onChange={() => setDeleteImage((prev) => !prev)}
      />
      <label className="text-red-600 font-medium">Delete Service Image</label>
    </div>
  </div>
)}

<div className="mt-4 flex flex-col gap-2">
  {service.serviceHeader && (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={deleteHeader}
        onChange={() => setDeleteHeader((prev) => !prev)}
      />
      <label className="text-red-600 font-medium">Delete service Header ({service.serviceHeader})</label>
    </div>
  )}

  {service.servicesDescription && (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={deleteServicesDescription}
        onChange={() => setDeleteServicesDescription((prev) => !prev)}
      />
      <label className="text-red-600 font-medium">Delete service Header ({service.servicesDescription})</label>
    </div>
  )}

  {service.toolHeading && (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={deleteToolHeading}
        onChange={() => setDeleteToolHeading((prev) => !prev)}
      />
      <label className="text-red-600 font-medium">Delete tool Heading ({service.toolHeading})</label>
    </div>
  )}
</div>
{service.tools && service.tools.length > 0 && (
  <div className="mt-4">
    <h3 className="text-lg font-semibold text-[#052c65] mb-2">Delete Tools</h3>
    {service.tools.map((tool, index) => (
      <div key={index} className="flex items-center gap-2 mb-1">
        <input
          type="checkbox"
          checked={selectedToolIndexes.includes(index)}
          onChange={() => toggleIndex("tool", index)}
        />
        <label className="text-red-600">
          {tool.tool} — {tool.toolDescription}
        </label>
      </div>
    ))}
  </div>
)}

{service.services && service.services.length > 0 && (
  <div className="mt-4">
    <h3 className="text-lg font-semibold text-[#052c65] mb-2">Delete Services</h3>
    {service.services.map((serviceItem, index) => (
      <div key={index} className="flex items-center gap-2 mb-1">
        <input
          type="checkbox"
          checked={selectedServiceIndexes.includes(index)}
          onChange={() => toggleIndex("service", index)}
        />
        <label className="text-red-600">
          {serviceItem.service} — {serviceItem.serviceDescription}
        </label>
      </div>
    ))}
  </div>
)}



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
