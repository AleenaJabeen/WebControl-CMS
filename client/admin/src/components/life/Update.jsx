import { useEffect, useState } from "react";
import axios from "axios";

export default function Update() {
  const [form, setForm] = useState({
    lifeImage: null,
    memories: [],
  });
  const [dataId,setDataId]=useState();

  const [previews, setPreviews] = useState({
    lifeImage: null,
    memories: [],
  });
  const BASE_URL = "http://localhost:8080";


  // Fetch existing data on mount
  useEffect(() => {
    const fetchLifeData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/life/read", {
          withCredentials: true,
        });

        const data = res.data.data;
        console.log(data);
        setDataId(data._id);
        console.log(data._id);
        setForm({
          lifeImage: null,
          memories: data.memories.map((mem) => ({
            name: mem.name,
            images: [],
            existingImages: mem.images,
          })),
        });

        setPreviews({
          lifeImage: data.lifeImage,
          memories: data.memories.map((mem) => ({
            images: mem.images,
          })),
        });
      } catch (err) {
        console.error("Failed to fetch life data:", err);
      }
    };
    console.log("hello")

    fetchLifeData();
  }, []);

  const handleLifeImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({ ...prev, lifeImage: file }));
    setPreviews((prev) => ({ ...prev, lifeImage: URL.createObjectURL(file) }));
  };

  const handleMemoryNameChange = (index, value) => {
    const updated = [...form.memories];
    updated[index].name = value;
    setForm((prev) => ({ ...prev, memories: updated }));
  };

 const handleMemoryImagesChange = (index, files) => {
  const updated = [...form.memories];
  updated[index].images = Array.from(files);
  updated[index].existingImages = []; // 👈 CLEAR OLD IMAGES

  const previewUrls = Array.from(files).map((file) => URL.createObjectURL(file));
  const updatedPreviews = [...previews.memories];
  updatedPreviews[index] = { images: previewUrls };

  setForm((prev) => ({ ...prev, memories: updated }));
  setPreviews((prev) => ({ ...prev, memories: updatedPreviews }));
};

  const addMemory = () => {
    setForm((prev) => ({
      ...prev,
      memories: [...prev.memories, { name: "", images: [] }],
    }));
    setPreviews((prev) => ({
      ...prev,
      memories: [...prev.memories, { images: [] }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      if (form.lifeImage) {
        formData.append("lifeImage", form.lifeImage);
      }

   form.memories.forEach((mem, index) => {
  mem.images.forEach((file) => {
    formData.append(`memoryImages-${index}`, file);  // key is important
  });
});

console.log(form.memories);
   const payload = form.memories.map((mem) => ({
  name: mem.name,
  existingImages: mem.existingImages || [],
}));
formData.append("memories", JSON.stringify(payload));;

      const res = await axios.patch(`http://localhost:8080/api/v1/life/update/${dataId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      alert("Life data updated successfully!");
    } catch (err) {
      console.error("Submit error: ", err);
      alert("Failed to update life data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 p-4 max-w-3xl">
      <h2 className="text-2xl font-semibold text-[#052c65]">Edit Life at Company</h2>

      {/* Life Image Upload */}
      <div>
        <label className="bg-[#052c65] text-white p-2 rounded cursor-pointer">
          Upload Life Banner Image
          <input type="file" name="lifeImage" onChange={handleLifeImageChange} hidden />
        </label>
         {/* new  */}
        {previews.lifeImage && (
          <img src={previews.lifeImage} alt="Preview" className="mt-2 h-16" />
        )}
        {previews.lifeImage && (
          <img src={`${BASE_URL}${previews.lifeImage}`} alt="Preview" className="mt-2 h-16" />
        )}
       
      </div>

      {/* Memories Section */}
      <div>
        <h3 className="text-xl text-[#052c65] mb-2">Memories</h3>
        {form.memories.map((mem, index) => (
          <div key={index} className="mb-4 border p-4 rounded shadow-sm">
            <input
              type="text"
              className="border p-2 w-full mb-2 rounded"
              placeholder="Memory name"
              value={mem.name}
              onChange={(e) => handleMemoryNameChange(index, e.target.value)}
            />

            {/* Upload memory images */}
            <input
              type="file"
              multiple
              onChange={(e) => handleMemoryImagesChange(index, e.target.files)}
              className="mb-2"
            />

          <div className="flex flex-wrap gap-2">
  {(previews.memories[index]?.images?.length > 0
    ? previews.memories[index].images
    : mem.existingImages
  ).map((src, i) => (
    <img key={i} src={src.startsWith('/') ? `${BASE_URL}${src}` : src} className="h-20" />
  ))}
</div>

          </div>
        ))}

        <button
          type="button"
          onClick={addMemory}
          className="bg-[#052c65] text-white p-2 rounded"
        >
          + Add Memory
        </button>
      </div>

      <button type="submit" className="bg-green-600 text-white p-3 rounded self-start">
        Update Changes
      </button>
    </form>
  );
}
