import { useState, useContext } from "react";
import { DataContext } from "../../context/Context";
import { IoMdAddCircle } from "react-icons/io";
import axios from "axios";

export default function Add() {
  const { setDataId } = useContext(DataContext);

  const [form, setForm] = useState({
    lifeImage: null,
    memories: [
      {
        name: "",
        images: [],
      },
    ],
  });

  const [previews, setPreviews] = useState({
    lifeImage: null,
    memories: [
      {
        images: [],
      },
    ],
  });

  const handleLifeImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, lifeImage: file }));
    setPreviews((prev) => ({ ...prev, lifeImage: URL.createObjectURL(file) }));
  };

  const handleMemoryNameChange = (index, value) => {
    const updatedMemories = [...form.memories];
    updatedMemories[index].name = value;
    setForm((prev) => ({ ...prev, memories: updatedMemories }));
  };

  const handleMemoryImagesChange = (index, files) => {
    const updatedMemories = [...form.memories];
    updatedMemories[index].images = Array.from(files);
    setForm((prev) => ({ ...prev, memories: updatedMemories }));

    const previewImages = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    const updatedPreviews = [...previews.memories];
    updatedPreviews[index] = { images: previewImages };
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

  const formData = new FormData();

  // ✅ Append life banner image
  if (!form.lifeImage) {
    alert("Life image is required");
    return;
  }
  formData.append("lifeImage", form.lifeImage);

  // ✅ Append memory data (names + image count)
  const memoriesToSend = form.memories.map((memory) => ({
    name: memory.name,
    imageCount: memory.images.length,
  }));

  formData.append("memories", JSON.stringify(memoriesToSend));

  // ✅ Append all images (flat)
  form.memories.forEach((memory) => {
    memory.images.forEach((imgFile) => {
      formData.append("images", imgFile);
    });
  });

  // DEBUG (optional)
  // for (let pair of formData.entries()) {
  //   console.log(pair[0], pair[1]);
  // }

  try {
    const res = await axios.post(
      "http://localhost:8080/api/v1/life/create",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    alert("Successfully submitted data in backend!");
    console.log(res.data);
    setDataId(res.data.data._id);
  } catch (err) {
    console.error("Submit error:", err);
    alert("Submit failed");
  }
};

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 p-4">
      {/* Life Image Upload */}
      <div className="flex flex-col gap-2">
        <label className="bg-[#052c65] text-white p-2 rounded cursor-pointer">
          Select Life Banner Image
          <input type="file" accept="image/*" onChange={handleLifeImageChange} className="hidden" />
        </label>
        {previews.lifeImage && (
          <img src={previews.lifeImage} alt="Life Banner Preview" className="w-32 h-auto" />
        )}
      </div>

      {/* Memories Section */}
      <div>
        <h2 className="text-[#052c65] text-xl mb-2">Memories</h2>
        {form.memories.map((memory, idx) => (
          <div key={idx} className="mb-4 border p-4 rounded">
            <input
              type="text"
              placeholder="Memory Name"
              className="border p-2 w-full mb-2"
              value={memory.name}
              onChange={(e) => handleMemoryNameChange(idx, e.target.value)}
            />

            <label className="bg-[#052c65] text-white p-2 rounded cursor-pointer">
              Select Memory Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleMemoryImagesChange(idx, e.target.files)}
                className="hidden"
              />
            </label>

            <div className="flex gap-2 flex-wrap mt-2">
              {previews.memories[idx]?.images.map((url, i) => (
                <img key={i} src={url} alt={`preview-${i}`} className="w-20 h-20 object-cover" />
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addMemory}
          className="flex items-center gap-2 bg-[#052c65] text-white p-2 rounded"
        >
          <IoMdAddCircle />
          Add Memory
        </button>
      </div>

      {/* Submit Button */}
      <button type="submit" className="bg-[#052c65] text-white p-3 text-lg rounded self-center">
        Submit
      </button>
    </form>
  );
}
