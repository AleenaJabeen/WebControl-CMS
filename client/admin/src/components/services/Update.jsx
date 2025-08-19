import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";

function Update() {
  const [form, setForm] = useState(null);
  const [dataId,setDataId]=useState();
  const [previews, setPreviews] = useState({
    serviceImage: null,
    toolImages: {},
     images: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/v1/service/read");
        const service = data.data[0];
setDataId(service._id);
        setForm({
          ...service,
          // reset file inputs
          serviceImage: null,
         
          tools: service.tools.map((tool) => ({
            ...tool,
            toolImage: null,
            originalToolImage: tool.toolImage, 
          })),
           services: service.services.map((service) => ({
            ...service,
            image: null, 
            originalServiceImage: service.image,
          })),
        });

        setPreviews({
          serviceImage: service.serviceImage,
          toolImages: (service.tools || []).reduce((acc, tool, index) => {
            acc[index] = tool.toolImage;
            return acc;
          }, {}),
          images: (service.services || []).reduce((acc, service, index) => {
            acc[index] = service.image;
            return acc;
          }, {}),
        });
      } catch (err) {
        console.error("Failed to fetch about data", err);
        alert("Fetch failed");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? Number(value) : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "partnerImages") {
      const imgs = Array.from(files).slice(0, 10);
      setForm((prev) => ({ ...prev, partnerImages: imgs }));
      setPreviews((prev) => ({
        ...prev,
        partnerImages: imgs.map((f) => URL.createObjectURL(f)),
      }));
    } else {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      setPreviews((prev) => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const handleToolChange = (index, key, value) => {
    const updated = [...form.tools];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, tools: updated }));
  };
  const handleServiceChange = (index, key, value) => {
    const updated = [...form.services];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, services: updated }));
  };

  const handleToolImageChange = (index, files) => {
    const file = files[0];
    const updated = [...form.tools];
    updated[index].toolImage = file;
    setForm((prev) => ({ ...prev, tools: updated }));

    setPreviews((prev) => ({
      ...prev,
      toolImages: { ...prev.toolImages, [index]: URL.createObjectURL(file) },
    }));
  };
   const handleServiceImageChange = (index, files) => {
    const file = files[0];
    const updated = [...form.services];
    updated[index].image = file;
    setForm((prev) => ({ ...prev, services: updated }));

    setPreviews((prev) => ({
      ...prev,
      images: { ...prev.images, [index]: URL.createObjectURL(file) },
    }));
  };

  const addTool = () => {
    setForm((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        { tool: "", toolDescription: "", toolImage: null },
      ],
    }));
  };
  const addService = () => {
    setForm((prev) => ({
      ...prev,
      services: [
        ...prev.services,
        { service: "", serviceDescription: "", image: null },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Add basic fields
    Object.entries(form).forEach(([key, value]) => {
      if (
        key !== "tools" &&
        key !== "services" &&
        !(value instanceof File) &&
        value !== null &&
        value !== ""
      ) {
        formData.append(key, value);
      }
    });

    if (form.serviceImage instanceof File) {
      formData.append("serviceImage", form.serviceImage);
    }


    // Build text part of innovativeIdeas
    const toolData = form.tools.map((tool) => ({
      tool: tool.tool,
      toolDescription: tool.toolDescription,
    }));
    formData.append("tools", JSON.stringify(toolData));

    // Attach idea images
    form.tools.forEach((tool, index) => {
      if (tool.toolImage instanceof File) {
        formData.append("toolImage", tool.toolImage, `tool-${index}-${tool.toolImage.name}`);
      }
    });

    const serviceData = form.services.map((service) => ({
      service: service.service,
      serviceDescription: service.serviceDescription,
    }));
    formData.append("services", JSON.stringify(serviceData));

    // Attach idea images
    form.services.forEach((service, index) => {
      if (service.image instanceof File) {
        formData.append("image", service.image, `image-${index}-${service.image.name}`);
      }
    });

    try {
      await axios.patch(`http://localhost:8080/api/v1/service/update/${dataId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("Service updated successfully");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold text-[#052c65]">Update Services</h2>

      <input name="serviceHeader" value={form.innovativeSmallText} onChange={handleInputChange} placeholder="Service Header" className="p-2 border" />
      <input name="toolHeading" value={form.toolHeading} onChange={handleInputChange} placeholder="Tool Heading" className="p-2 border" />
      <textarea name="servicesDescription" value={form.servicesDescription} onChange={handleInputChange} placeholder="Description" className="p-2 border" />

      <h3 className="text-lg font-semibold">Tools</h3>
      {form.tools.map((tool, index) => (
        <div key={index} className="p-2 border rounded">
          <input type="text" placeholder="Tool" value={tool.tool} onChange={(e) => handleToolChange(index, "tool", e.target.value)} className="p-2 border w-full" />
          <input type="text" placeholder="Description" value={tool.toolDescription} onChange={(e) => handleToolChange(index, "toolDescription", e.target.value)} className="p-2 border w-full mt-2" />
          <label>
            Tool Image:
            <input type="file" accept="image/*" onChange={(e) => handleToolImageChange(index, e.target.files)} />
          </label>
          {previews.toolImages[index] && <img src={`http://localhost:8080${previews.toolImages[index]}`} width={80} className="mt-2 rounded border" />}
        </div>
      ))}
      <button type="button" onClick={addTool} className="bg-blue-600 text-white p-2 rounded mt-2">
        <IoMdAddCircle className="inline mr-1" />
        Add Tool
      </button>
       <h3 className="text-lg font-semibold">Services</h3>
      {form.services.map((service, index) => (
        <div key={index} className="p-2 border rounded">
          <input type="text" placeholder="Service" value={service.service} onChange={(e) => handleServiceChange(index, "service", e.target.value)} className="p-2 border w-full" />
          <input type="text" placeholder="Description" value={service.serviceDescription} onChange={(e) => handleServiceChange(index, "serviceDescription", e.target.value)} className="p-2 border w-full mt-2" />
          <label>
            Service Image:
            <input type="file" accept="image/*" onChange={(e) => handleServiceImageChange(index, e.target.files)} />
          </label>
          {previews.images[index] && <img src={`http://localhost:8080${previews.images[index]}`} width={80} className="mt-2 rounded border" />}
        </div>
      ))}
      <button type="button" onClick={addService} className="bg-blue-600 text-white p-2 rounded mt-2">
        <IoMdAddCircle className="inline mr-1" />
        Add Services
      </button>

     
      <label>
        Service Image:
        <input type="file" name="serviceImage" accept="image/*" onChange={handleFileChange} />
        {previews.serviceImage && <img src={`http://localhost:8080${previews.serviceImage}`} width={100} />}
      </label>

      <button type="submit" className="bg-[#052c65] text-white p-2 rounded mt-4 text-xl">
        Update
      </button>
    </form>
  );
}

export default Update;
