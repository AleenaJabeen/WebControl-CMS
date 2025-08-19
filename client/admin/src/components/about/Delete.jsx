import React, { useEffect, useState } from "react";
import axios from "axios";

function Delete() {
  const [dataId,setDataId]=useState();
  const [about, setAbout] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [deleteAboutImage, setDeleteAboutImage] = useState(false);
  const [deleteAboutBannerImage, setDeleteAboutBannerImage] = useState(false);
  const [selectedPartnerImageIndexes, setSelectedPartnerImageIndexes] = useState([]);
  const [selectedIdeaImageIndexes, setSelectedIdeaImageIndexes] = useState([]);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/api/v1/about/read");
        setAbout(data.data);
        setDataId(data.data[0]._id);
        console.log(data.data[0]._id);
      } catch (err) {
        console.error("Error fetching About data", err);
      }
    };

    fetchAbout();
  }, []);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setSelectedFields((prev) =>
      checked ? [...prev, value] : prev.filter((f) => f !== value)
    );
  };

  const toggleImageIndex = (index, type) => {
    const updater = type === "partner" ? setSelectedPartnerImageIndexes : setSelectedIdeaImageIndexes;
    const current = type === "partner" ? selectedPartnerImageIndexes : selectedIdeaImageIndexes;

    if (current.includes(index)) {
      updater(current.filter((i) => i !== index));
    } else {
      updater([...current, index]);
    }
  };

  const handleDelete = async () => {
    const payload = {
      fields: selectedFields,
      deleteAboutImage,
      deleteAboutBannerImage,
      partnerImages: selectedPartnerImageIndexes, // ✅ rename this
  innovativeIdeas: selectedIdeaImageIndexes, 
    };

    try {
      await axios.patch(`http://localhost:8080/api/v1/about/deleteOne/${dataId}`,
         payload,{
          withCredentials:true
        });
      alert("Selected fields deleted!");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete selected fields");
    }
  };

  const handleDeleteAll=async()=>{
     try {
      await axios.delete(`http://localhost:8080/api/v1/about/deleteAll/${dataId}`,
   {
          withCredentials:true
        });
      alert("All fields deleted!");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete All fields");
    }

  }

  if (!about) return <div>Loading...</div>;

  return (
    <div className="p-4 ">
      <h2 className="text-2xl font-bold mb-4 text-red-700">Delete Fields from About</h2>

      <div className="mb-4">
        <h3 className="font-semibold">Select Fields to Delete:</h3>
        {[
          "innovativeSmallText",
          "innovativeHeader",
          "innovativeDescription",
          "experienceYears",
          "awards",
          "projectsNumber",
          "aboutAuthor",
          "authorPosition",
          "partnerHeader",
          "partnerDescription",
        ].map((field) => (
          <label key={field} className="block">
            <input
              type="checkbox"
              value={field}
              checked={selectedFields.includes(field)}
              onChange={handleCheckboxChange}
              className="mr-2"
            />
            {field}
          </label>
        ))}
      </div>

      <div className="mb-4">
        <label className="block">
          <input
            type="checkbox"
            checked={deleteAboutImage}
            onChange={(e) => setDeleteAboutImage(e.target.checked)}
            className="mr-2"
          />
          Delete About Image
        </label>

        <label className="block mt-2">
          <input
            type="checkbox"
            checked={deleteAboutBannerImage}
            onChange={(e) => setDeleteAboutBannerImage(e.target.checked)}
            className="mr-2"
          />
          Delete About Banner Image
        </label>
      </div>

      {about.partnerImages && about.partnerImages.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Select Partner Images to Delete:</h3>
          <div className="flex flex-wrap gap-2">
            {about.partnerImages.map((img, idx) => (
              <label key={idx} className="flex flex-col items-center text-sm">
                <input
                  type="checkbox"
                  checked={selectedPartnerImageIndexes.includes(idx)}
                  onChange={() => toggleImageIndex(idx, "partner")}
                />
                <img src={img} alt="partner" width={80} className="border rounded mt-1" />
              </label>
            ))}
          </div>
        </div>
      )}

      {about.innovativeIdeas && about.innovativeIdeas.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold">Select Idea Images to Delete:</h3>
          <div className="flex flex-wrap gap-2">
            {about.innovativeIdeas.map((idea, idx) => (
              <label key={idx} className="flex flex-col items-center text-sm">
                <input
                  type="checkbox"
                  checked={selectedIdeaImageIndexes.includes(idx)}
                  onChange={() => toggleImageIndex(idx, "idea")}
                />
                <img src={idea.ideaImage} alt="idea" width={80} className="border rounded mt-1" />
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleDelete}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4 m-2"
      >
        Delete Selected Fields
      </button>
        <button
        onClick={handleDeleteAll}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mt-4"
      >
        Delete Selected All
      </button>
    </div>
  );
}

export default Delete;
