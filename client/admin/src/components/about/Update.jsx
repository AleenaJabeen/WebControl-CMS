import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoMdAddCircle } from "react-icons/io";

function Update() {
  const [form, setForm] = useState(null);
  const [dataId,setDataId]=useState();
  const [previews, setPreviews] = useState({
    aboutImage: null,
    aboutBannerImage: null,
    partnerImages: [],
    ideaImages: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/v1/about/read");
        const about = data.data[0];
setDataId(about._id);
        setForm({
          ...about,
          partnerImages: [], // reset file inputs
          aboutImage: null,
          aboutBannerImage: null,
          innovativeIdeas: about.innovativeIdeas.map((idea) => ({
            ...idea,
            ideaImage: null, // reset idea image file
            originalIdeaImage: idea.ideaImage, // store original URL
          })),
        });

        setPreviews({
          aboutImage: about.aboutImage,
          aboutBannerImage: about.aboutBannerImage,
          partnerImages: about.partnerImages || [],
          ideaImages: (about.innovativeIdeas || []).reduce((acc, idea, index) => {
            acc[index] = idea.ideaImage;
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

  const handleIdeaChange = (index, key, value) => {
    const updated = [...form.innovativeIdeas];
    updated[index][key] = value;
    setForm((prev) => ({ ...prev, innovativeIdeas: updated }));
  };

  const handleIdeaImageChange = (index, files) => {
    const file = files[0];
    const updated = [...form.innovativeIdeas];
    updated[index].ideaImage = file;
    setForm((prev) => ({ ...prev, innovativeIdeas: updated }));

    setPreviews((prev) => ({
      ...prev,
      ideaImages: { ...prev.ideaImages, [index]: URL.createObjectURL(file) },
    }));
  };

  const addIdea = () => {
    setForm((prev) => ({
      ...prev,
      innovativeIdeas: [
        ...prev.innovativeIdeas,
        { idea: "", ideaDescription: "", ideaImage: null },
      ],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Add basic fields
    Object.entries(form).forEach(([key, value]) => {
      if (
        key !== "partnerImages" &&
        key !== "innovativeIdeas" &&
        !(value instanceof File) &&
        value !== null &&
        value !== ""
      ) {
        formData.append(key, value);
      }
    });

    if (form.aboutImage instanceof File) {
      formData.append("aboutImage", form.aboutImage);
    }

    if (form.aboutBannerImage instanceof File) {
      formData.append("aboutBannerImage", form.aboutBannerImage);
    }

    form.partnerImages?.forEach((img) => {
      if (img instanceof File) {
        formData.append("partnerImages", img);
      }
    });

    // Build text part of innovativeIdeas
    const ideaData = form.innovativeIdeas.map((idea) => ({
      idea: idea.idea,
      ideaDescription: idea.ideaDescription,
    }));
    formData.append("innovativeIdeas", JSON.stringify(ideaData));

    // Attach idea images
    form.innovativeIdeas.forEach((idea, index) => {
      if (idea.ideaImage instanceof File) {
        formData.append("ideaImage", idea.ideaImage, `idea-${index}-${idea.ideaImage.name}`);
      }
    });

    try {
      await axios.patch(`http://localhost:8080/api/v1/about/update/${dataId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("About updated successfully");
    } catch (err) {
      console.error("Update failed", err);
      alert("Update failed");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold text-[#052c65]">Update About</h2>

      <input name="innovativeSmallText" value={form.innovativeSmallText} onChange={handleInputChange} placeholder="Small Text" className="p-2 border" />
      <input name="innovativeHeader" value={form.innovativeHeader} onChange={handleInputChange} placeholder="Header" className="p-2 border" />
      <textarea name="innovativeDescription" value={form.innovativeDescription} onChange={handleInputChange} placeholder="Description" className="p-2 border" />

      <h3 className="text-lg font-semibold">Innovative Ideas</h3>
      {form.innovativeIdeas.map((idea, index) => (
        <div key={index} className="p-2 border rounded">
          <input type="text" placeholder="Idea" value={idea.idea} onChange={(e) => handleIdeaChange(index, "idea", e.target.value)} className="p-2 border w-full" />
          <input type="text" placeholder="Description" value={idea.ideaDescription} onChange={(e) => handleIdeaChange(index, "ideaDescription", e.target.value)} className="p-2 border w-full mt-2" />
          <label>
            Idea Image:
            <input type="file" accept="image/*" onChange={(e) => handleIdeaImageChange(index, e.target.files)} />
          </label>
          {previews.ideaImages[index] && <img src={`http://localhost:8080${previews.ideaImages[index]}`} width={80} className="mt-2 rounded border" />}
        </div>
      ))}
      <button type="button" onClick={addIdea} className="bg-blue-600 text-white p-2 rounded mt-2">
        <IoMdAddCircle className="inline mr-1" />
        Add Idea
      </button>

      <input type="number" name="experienceYears" value={form.experienceYears || ""} onChange={handleInputChange} placeholder="Years" className="p-2 border" />
      <input type="number" name="awards" value={form.awards || ""} onChange={handleInputChange} placeholder="Awards" className="p-2 border" />
      <input type="number" name="projectsNumber" value={form.projectsNumber || ""} onChange={handleInputChange} placeholder="Projects" className="p-2 border" />

      <input type="text" name="aboutAuthor" value={form.aboutAuthor} onChange={handleInputChange} placeholder="Author" className="p-2 border" />
      <input type="text" name="authorPosition" value={form.authorPosition} onChange={handleInputChange} placeholder="Position" className="p-2 border" />
      <input type="text" name="partnerHeader" value={form.partnerHeader} onChange={handleInputChange} placeholder="Partner Header" className="p-2 border" />
      <textarea name="partnerDescription" value={form.partnerDescription} onChange={handleInputChange} placeholder="Partner Description" className="p-2 border" />

      <label>
        About Image:
        <input type="file" name="aboutImage" accept="image/*" onChange={handleFileChange} />
        {previews.aboutImage && <img src={`http://localhost:8080${previews.aboutImage}`} width={100} />}
      </label>

      <label>
        Banner Image:
        <input type="file" name="aboutBannerImage" accept="image/*" onChange={handleFileChange} />
        {previews.aboutBannerImage && <img src={`http://localhost:8080${previews.aboutBannerImage}`} width={100} />}
      </label>

      <label>
        Partner Images:
        <input type="file" name="partnerImages" accept="image/*" multiple onChange={handleFileChange} />
        <div className="flex gap-2 mt-2 flex-wrap">
          {previews.partnerImages.map((src, i) => (
            <img key={i} src={`http://localhost:8080${src}`} width={80} className="rounded border" />
          ))}
        </div>
      </label>

      <button type="submit" className="bg-[#052c65] text-white p-2 rounded mt-4 text-xl">
        Update
      </button>
    </form>
  );
}

export default Update;
