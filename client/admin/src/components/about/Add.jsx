import React, { useState } from "react";
import { IoMdAddCircle } from "react-icons/io";
import axios from "axios";

function Add() {
  const [form, setForm] = useState({
    innovativeSmallText: "",
    innovativeHeader: "",
    innovativeDescription: "",
    innovativeIdeas: [{ idea: "", ideaImage: null, ideaDescription: "" }],
    experienceYears: null,
    awards: null,
    projectsNumber: null,
    aboutAuthor: "",
    authorPosition: "",
    partnerHeader: "",
    partnerDescription: "",
    aboutImage: null,
    aboutBannerImage: null,
    partnerImages: [],
  });

  const [previews, setPreviews] = useState({
    aboutImage: null,
    aboutBannerImage: null,
    partnerImages: [],
    ideaImages: {}, // indexed previews for idea images
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

  const handleIdeaChange = (index, key, value) => {
    const updatedIdeas = [...form.innovativeIdeas];
    updatedIdeas[index][key] = value;
    setForm((prev) => ({ ...prev, innovativeIdeas: updatedIdeas }));
  };

  const handleIdeaImageChange = (index, files) => {
  const file = files[0]; // only take the first file
  const updatedIdeas = [...form.innovativeIdeas];
  updatedIdeas[index].ideaImage = file;
  setForm((prev) => ({ ...prev, innovativeIdeas: updatedIdeas }));

  const previewUrl = URL.createObjectURL(file);
  setPreviews((prev) => ({
    ...prev,
    ideaImages: { ...prev.ideaImages, [index]: previewUrl },
  }));
};


  const addIdea = () => {
    setForm((prev) => ({
      ...prev,
      innovativeIdeas: [
        ...prev.innovativeIdeas,
        { idea: "", ideaImage: [], ideaDescription: "" },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append simple fields (excluding arrays/files)
    const excludedKeys = ["partnerImages", "innovativeIdeas"];
    Object.keys(form).forEach((key) => {
      if (!excludedKeys.includes(key)) {
        formData.append(key, form[key]);
      }
    });

    // Append partner images
    form.partnerImages.forEach((file) => {
      formData.append("partnerImages", file);
    });

    // Append ideas (text data)
    const ideaData = form.innovativeIdeas.map((idea) => ({
      idea: idea.idea,
      ideaDescription: idea.ideaDescription,
    }));
    formData.append("innovativeIdeas", JSON.stringify(ideaData));

    // Append idea images
   form.innovativeIdeas.forEach((idea, index) => {
  if (idea.ideaImage) {
    formData.append("ideaImage", idea.ideaImage, `idea-${index}-${idea.ideaImage.name}`);
  }
});

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/about/create",
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
      <input name="innovativeSmallText" placeholder="Innovative Small Text" value={form.innovativeSmallText} onChange={handleInputChange} className="p-2 border" />
      <input name="innovativeHeader" placeholder="Innovative Header" value={form.innovativeHeader} onChange={handleInputChange} className="p-2 border" />
      <textarea name="innovativeDescription" placeholder="Innovative Description" value={form.innovativeDescription} onChange={handleInputChange} className="p-2 border" />

      {/* Ideas Section */}
      <div>
        <h3 className="text-lg font-semibold">Innovative Ideas</h3>
        {form.innovativeIdeas.map((item, index) => (
          <div key={index} className="my-2 p-2 border rounded">
            <input type="text" placeholder="Idea" value={item.idea} onChange={(e) => handleIdeaChange(index, "idea", e.target.value)} className="p-2 border w-full" />
            <input type="text" placeholder="Idea Description" value={item.ideaDescription} onChange={(e) => handleIdeaChange(index, "ideaDescription", e.target.value)} className="p-2 border w-full my-2" />

            <label>
  Upload Idea Image:
  <input
    type="file"
    accept="image/*"
    onChange={(e) => handleIdeaImageChange(index, e.target.files)}
  />
</label>

{previews.ideaImages?.[index] && (
  <img src={previews.ideaImages[index]} width={80} className="border rounded mt-2" />
)}
          </div>
        ))}
        <button type="button" onClick={addIdea} className="bg-blue-600 text-white p-2 rounded mt-2">
          <IoMdAddCircle className="inline" /> Add Idea
        </button>
      </div>

      {/* Numbers */}
      <input type="number" name="experienceYears" placeholder="Experience Years" value={form.experienceYears || ""} onChange={handleInputChange} className="p-2 border" />
      <input type="number" name="awards" placeholder="Awards" value={form.awards || ""} onChange={handleInputChange} className="p-2 border" />
      <input type="number" name="projectsNumber" placeholder="Projects Number" value={form.projectsNumber || ""} onChange={handleInputChange} className="p-2 border" />

      {/* Author Info */}
      <input type="text" name="aboutAuthor" placeholder="About Author" value={form.aboutAuthor} onChange={handleInputChange} className="p-2 border" />
      <input type="text" name="authorPosition" placeholder="Author Position" value={form.authorPosition} onChange={handleInputChange} className="p-2 border" />

      {/* Partner Section */}
      <input type="text" name="partnerHeader" placeholder="Partner Header" value={form.partnerHeader} onChange={handleInputChange} className="p-2 border" />
      <textarea name="partnerDescription" placeholder="Partner Description" value={form.partnerDescription} onChange={handleInputChange} className="p-2 border" />

      {/* Image Uploads */}
      <label>
        About Image:
        <input type="file" name="aboutImage" accept="image/*" onChange={handleFileChange} />
        {previews.aboutImage && <img src={previews.aboutImage} width={100} />}
      </label>

      <label>
        About Banner Image:
        <input type="file" name="aboutBannerImage" accept="image/*" onChange={handleFileChange} />
        {previews.aboutBannerImage && <img src={previews.aboutBannerImage} width={100} />}
      </label>

      <label>
        Partner Images (Max 10):
        <input type="file" name="partnerImages" accept="image/*" multiple onChange={handleFileChange} />
        <div className="flex flex-wrap gap-2 mt-2">
          {previews.partnerImages?.map((src, idx) => (
            <img key={idx} src={src} width={80} className="border rounded" />
          ))}
        </div>
      </label>

      <button type="submit" className="bg-[#052c65] text-white p-2 text-xl rounded mt-4">
        Submit
      </button>
    </form>
  );
}

export default Add;
