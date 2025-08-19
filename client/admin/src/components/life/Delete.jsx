import { useEffect, useState } from "react";
import axios from "axios";

export default function Delete() {

  const [life, setLife] = useState(null);
  const [dataId, setDataId] = useState("");
  const [selectedMemories, setSelectedMemories] = useState([]);
  const [selectedLifeImage, setSelectedLifeImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState({});

  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchLifeData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/life/read", {
          withCredentials: true,
        });
        setLife(res.data.data);
        setDataId(res.data.data._id);
      } catch (err) {
        console.error("Failed to fetch life data:", err);
      }
    };
    fetchLifeData();
  }, []);

  const toggleMemory = (index) => {
    setSelectedMemories((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleImage = (memIndex, image) => {
    setSelectedImages((prev) => {
      const current = prev[memIndex] || [];
      const updated = current.includes(image)
        ? current.filter((img) => img !== image)
        : [...current, image];
      return { ...prev, [memIndex]: updated };
    });
  };

  const handleDeleteSelected = async () => {
    try {
      await axios.patch(
        `http://localhost:8080/api/v1/life/deleteOne/${dataId}`,
        {
          memoryIndexesToDelete: selectedMemories,
          memoryImagesToDelete: selectedImages,
          deleteLifeImage: selectedLifeImage,
        },
        { withCredentials: true }
      );
      alert("Selected memories/images deleted successfully");
      window.location.reload(); // or re-fetch data
    } catch (err) {
      console.error("Delete selected error:", err);
      alert("Failed to delete selected items.");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/v1/life/deleteAll/${dataId}`, {
        withCredentials: true,
      });
      alert("All life data deleted successfully");
      setLife(null); // Clear state
    } catch (err) {
      console.error("Delete all error:", err);
      alert("Failed to delete all life data.");
    }
  };

  if (!life) return <p className="p-4 text-gray-500">Loading life data...</p>;

  return (
    <div className="p-4 w-full">
      <h2 className="text-2xl font-bold text-[#052c65] mb-6">Delete Life Data</h2>

      {/* Life Banner Image */}
    <div className="mb-6">
  <h3 className="text-lg font-semibold mb-2">Life Banner</h3>
  <div className="relative w-fit">
    <img
      src={`${BASE_URL}${life.lifeImage}`}
      alt="Life Banner"
      className="h-24 rounded shadow"
    />
    <label className="absolute top-1 right-1 bg-white px-2 py-1 rounded shadow text-xs flex items-center space-x-1">
      <input
        type="checkbox"
        checked={selectedLifeImage}
        onChange={() => setSelectedLifeImage(!selectedLifeImage)}
      />
      <span>Delete</span>
    </label>
  </div>
</div>


      {/* Memories */}
      <div>
        <h3 className="text-xl font-semibold text-[#052c65] mb-4">Memories</h3>
        {life.memories.map((mem, index) => (
          <div
            key={index}
            className="mb-6 border border-gray-300 rounded p-4 shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-lg">{mem.name}</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedMemories.includes(index)}
                  onChange={() => toggleMemory(index)}
                />
                <span className="text-sm">Delete this memory</span>
              </label>
            </div>

            {/* Images */}
            <div className="flex flex-wrap gap-4">
              {mem.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={`${BASE_URL}${img}`}
                    alt="Memory"
                    className="h-24 w-24 object-cover rounded"
                  />
                  <label className="absolute top-1 right-1 bg-white p-1 rounded shadow text-xs">
                    <input
                      type="checkbox"
                      checked={selectedImages[index]?.includes(img) || false}
                      onChange={() => toggleImage(index, img)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleDeleteSelected}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Delete Selected
        </button>

        <button
          onClick={handleDeleteAll}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Delete All
        </button>
      </div>
    </div>
  );
}
