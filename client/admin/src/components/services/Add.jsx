import React, { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import axios from "axios";

function Add() {
  const [form, setForm] = useState({
   serviceHeader: "",
    servicesDescription: "",
    services: [{ service: "", image: null, serviceDescription: "" }],
    tools: [{ tool: "", toolImage: null, toolDescription: "" }],
    toolHeading: "",
    serviceImage: null,
  });

  const [previews, setPreviews] = useState({
    serviceImage: null,
    toolImages: {},
     images: {}, 
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "partnerImages") {
      const fileArray = Array.from(files).slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: fileArray }));
      const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => ({ ...prev, [name]: previewUrls }));
    } else {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      const previewUrl = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [name]: previewUrl }));
    }
  };

  const handleToolChange = (index, key, value) => {
    const updatedTools = [...form.tools];
    updatedTools[index][key] = value;
    setForm((prev) => ({ ...prev, tools: updatedTools }));
  };

  const handleToolImageChange = (index, files) => {
  const file = files[0]; // only take the first file
  const updatedTools = [...form.tools];
  updatedTools[index].toolImage = file;
  setForm((prev) => ({ ...prev, tools: updatedTools }));

  const previewUrl = URL.createObjectURL(file);
  setPreviews((prev) => ({
    ...prev,
    toolImages: { ...prev.toolImages, [index]: previewUrl },
  }));
};


  const addTool = () => {
    setForm((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        { tool: "", toolImage: [], toolDescription: "" },
      ],
    }));
  };
 const handleServiceChange = (index, key, value) => {
    const updatedServices = [...form.services];
    updatedServices[index][key] = value;
    setForm((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleServiceImageChange = (index, files) => {
  const file = files[0]; // only take the first file
  const updatedServices = [...form.services];
  updatedServices[index].image = file;
  setForm((prev) => ({ ...prev, services: updatedServices }));

  const previewUrl = URL.createObjectURL(file);
  setPreviews((prev) => ({
    ...prev,
    images: { ...prev.images, [index]: previewUrl },
  }));
};


  const addService = () => {
    setForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { service: "", image: [], serviceDescription: "" },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append simple fields (excluding arrays/files)
    const excludedKeys = ["services", "tools"];
    Object.keys(form).forEach((key) => {
      if (!excludedKeys.includes(key)) {
        formData.append(key, form[key]);
      }
    });

    // Append tools(text data)
    const toolData = form.tools.map((tool) => ({
      tool: tool.tool,
      toolDescription: tool.toolDescription,
    }));
    formData.append("tools", JSON.stringify(toolData));

    // Append tools(text data)
    const serviceData = form.services.map((service) => ({
      service: service.service,
    serviceDescription: service.serviceDescription,
    }));
    formData.append("services", JSON.stringify(serviceData));

    // Append idea images
   form.tools.forEach((tool, index) => {
  if (tool.toolImage) {
    formData.append("toolImage", tool.toolImage, `tool-${index}-${tool.toolImage.name}`);
  }
  
});
form.services.forEach((service, index) => {
  if (service.image) {
    formData.append("image", service.image, `image-${index}-${service.image.name}`);
  }
  
});

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/service/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      alert("Data submitted successfully");
    } catch (err) {
      console.error("Error submitting:", err);
      alert("Failed to submit");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold text-[#052c65]">Add About Data</h2>

      {/* Text Fields */}
      <input name="serviceHeader" placeholder="Service Header" value={form.serviceHeader} onChange={handleInputChange} className="p-2 border" />
      <textarea name="servicesDescription" placeholder="Service Description" value={form.servicesDescription} onChange={handleInputChange} className="p-2 border" />
      <input name="toolHeading" placeholder="Tool Header" value={form.toolHeading} onChange={handleInputChange} className="p-2 border" />

      {/* Tools Section */}
      <div>
        <h3 className="text-lg font-semibold">Tools</h3>
        {form.tools.map((item, index) => (
          <div key={index} className="my-2 p-2 border rounded">
            <input type="text" placeholder="tool" value={item.tool} onChange={(e) => handleToolChange(index, "tool", e.target.value)} className="p-2 border w-full" />
            <input type="text" placeholder="tool Description" value={item.toolDescription} onChange={(e) => handleToolChange(index, "toolDescription", e.target.value)} className="p-2 border w-full my-2" />

            <label>
  Upload tool Image:
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleToolImageChange(index, e.target.files)}
  />
</label>

{previews.toolImages?.[index] && (
  <img src={previews.toolImages[index]} width={80} className="border rounded mt-2" />
)}
          </div>
        ))}
        <button type="button" onClick={addTool} className="bg-blue-600 text-white p-2 rounded mt-2">
          <IoMdAddCircle className="inline" /> Add Tool
        </button>
      </div>

      {/* Service */}
        <div>
        <h3 className="text-lg font-semibold">Tools</h3>
        {form.services.map((item, index) => (
          <div key={index} className="my-2 p-2 border rounded">
            <input type="text" placeholder="service" value={item.service} onChange={(e) => handleServiceChange(index, "service", e.target.value)} className="p-2 border w-full" />
            <input type="text" placeholder="service Description" value={item.serviceDescription} onChange={(e) => handleServiceChange(index, "serviceDescription", e.target.value)} className="p-2 border w-full my-2" />

            <label>
  Upload service Image:
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleServiceImageChange(index, e.target.files)}
  />
</label>

{previews.images?.[index] && (
  <img src={previews.images[index]} width={80} className="border rounded mt-2" />
)}
          </div>
        ))}
        <button type="button" onClick={addService} className="bg-blue-600 text-white p-2 rounded mt-2">
          <IoMdAddCircle className="inline" /> Add Service
        </button>
      </div>


     
      

      {/* Image Uploads */}
      <label>
        Service Image:
        <input type="file" name="serviceImage" accept="image/*" onChange={handleFileChange} />
        {previews.serviceImage && <img src={previews.serviceImage} width={100} />}
      </label>



      <button type="submit" className="bg-[#052c65] text-white p-2 text-xl rounded mt-4">
        Submit
      </button>
    </form>
  );
}

export default Add;
