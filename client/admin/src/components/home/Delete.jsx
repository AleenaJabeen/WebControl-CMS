import React, { useEffect, useState } from "react";
import axios from "axios";

const DeleteSections = () => {
  const [homeData, setHomeData] = useState(null);
  const [selectedSections, setSelectedSections] = useState([]);
  const [docId, setDocId] = useState("");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/home/read");
        const data = res.data?.data?.[0];
        if (data) {
          setHomeData(data);
          setDocId(data._id);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };

    fetchHomeData();
  }, []);

  const toggleSection = (section) => {
    setSelectedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };
  const handleDeleteAll = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/v1/home/deleteAll/${docId}`,
        { withCredentials: true }
      );
      console.log("Delete All Response:", response.data);
      alert("All documents deleted!");
    } catch (err) {
      console.error("Delete All Error:", err);
      alert("Failed to delete all documents.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!docId || selectedSections.length === 0) return;

    try {
      await axios.patch(
        `http://localhost:8080/api/v1/home/deleteOne/${docId}`,
        { sections: selectedSections },
        { withCredentials: true }
      );
      alert("Selected sections deleted successfully!");
      setSelectedSections([]);

      // Refresh data
      const res = await axios.get("http://localhost:8080/api/v1/home/read");
      const data = res.data?.data?.[0];
      if (data) {
        setHomeData(data);
        setDocId(data._id);
      } else {
        setHomeData(null);
      }
    } catch (err) {
      console.error("Error deleting sections:", err);
      alert("Failed to delete selected sections.");
    }
  };

  if (!homeData) return <div>Loading home data...</div>;

  const sections = ["header", "banner", "footer", "director"];

  return (
    <form className="p-6 w-full space-y-4">
      <h2 className="text-xl font-bold mb-4">Delete Home Sections</h2>

      {sections.map((section) => (
        <label key={section} className="block">
          <input
            type="checkbox"
            checked={selectedSections.includes(section)}
            onChange={() => toggleSection(section)}
            className="mr-2"
          />
          {section} {homeData[section] ? "(exists)" : "(missing)"}
        </label>
      ))}

      <button
        onClick={handleSubmit}
        disabled={selectedSections.length === 0}
        className="bg-red-600 text-white px-4 py-2 mx-4 rounded hover:bg-red-700 disabled:opacity-50"
      >
        Delete Selected Sections
      </button>
      <button
       onClick={handleDeleteAll}
        
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
      >
        Delete All
      </button>
    </form>
  );
};

export default DeleteSections;
