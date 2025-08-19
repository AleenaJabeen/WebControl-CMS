import React, { useContext, useState } from "react";
import { DataContext } from "../../context/Context";
import axios from "axios";

function Add() {
  const { setDataId } = useContext(DataContext);
  const [form, setForm] = useState({
    careerImage: null,
    jobs: [],
    fields: [{ label: "", inputType: "" }],
  });

  const [previews, setPreviews] = useState({
    careerImage: null,
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;
    setForm((prev) => ({ ...prev, [name]: file }));
    const previewUrl = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [name]: previewUrl }));
  };

  const handleJobChange = (index, value) => {
    const updatedJob = [...form.jobs];
    updatedJob[index] = value;
    setForm((prev) => ({ ...prev, jobs: updatedJob }));
  };
  const handleFieldsChange = (index, field, value) => {
    const updatedFields = [...form.fields];
    updatedFields[index][field] = value;
    setForm((prev) => ({ ...prev, fields: updatedFields }));
  };

  const addFormFields = () => {
    setForm((prev) => ({
      ...prev,
      fields: [...prev.fields, { label: "", inputType: "" }],
    }));
  };

  const addJob = () => {
    setForm((prev) => ({
      ...prev,
      jobs: [...prev.jobs, ""],
    }));
  };

  const inputValidations = (form) => {
    if (
      form.jobs === null ||
      form.fields === null ||
      form.careerImage === null
    ) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      if (inputValidations(form)) {
        const formData = new FormData();
        formData.append("careerImage", form.careerImage);
        formData.append("jobs", JSON.stringify(form.jobs));
        formData.append("fields", JSON.stringify(form.fields));
        const response = await axios.post(
          "http://localhost:8080/api/v1/career/create",
          formData,
          {
            withCredentials: true,
          }
        );
        console.log("response", response.data.data._id);
        setDataId(response.data.data._id);
        console.log("data",dataId)

        alert("Settings saved!", response.message);
      } else {
        alert("All fields are required");
      }
    } catch (error) {
      alert("Error occured while craeting career data");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex-col gap-8 border my-6 p-4 rounded border-[#052c65]" >
        <div className="w-full flex gap-6 justify-between items-stretch my-6">
       <div className="h-auto">
        {form.jobs.map((item, idx) => (
          <div key={idx} className="flex items-center justify-center gap-4">
             <h3 className="text-[#052c65] text-xl">Jobs</h3>
            <input
             className="p-2 pe-6 border focus:outline-none border-gray-400 mb-2 rounded"
              placeholder="Name"
              value={item}
              onChange={(e) => handleJobChange(idx, e.target.value)}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addJob}
          className="text-white rounded bg-[#052c65] p-2 text-xl flex items-center gap-2"
        >
          Add Jobs
        </button>
      </div>
      <div className="h-auto">
        {form.fields.map((item, idx) => (
          <div key={idx} className="flex items-center justify-center gap-4">
             <h3 className="text-[#052c65] text-xl">Fields</h3>
            <input
             className="p-2 pe-6 border focus:outline-none border-gray-400 mb-2 rounded"
              placeholder="Label"
              value={item.label}
              onChange={(e) => handleFieldsChange(idx, "label", e.target.value)}
            />
            <input
             className="p-2 pe-6 border focus:outline-none border-gray-400 mb-2 rounded"
              placeholder="Input Type"
              value={item.inputType}
              onChange={(e) =>
                handleFieldsChange(idx, "inputType", e.target.value)
              }
            />
          </div>
        ))}
        <button
          type="button"
          onClick={addFormFields}
          className="text-white rounded bg-[#052c65] p-2 text-xl flex items-center gap-2"
        >
          Add Form Fields
        </button>
      </div>
      </div>
      <div className="flex">
      <div className="flex gap-2">
        <label className="bg-[#052c65] text-white text-xl p-2 rounded">
          Select Career Banner Image
          <input
            name="careerImage"
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        {previews.careerImage && (
          <img
            src={previews.careerImage}
            alt="Career Image Preview"
            style={{ width: 100, height: "auto", marginTop: 10 }}
          />
        )}
      </div>
      </div>
    
      <br />
      <div className="w-full flex justify-center items-center my-6">
      <button
        type="submit"
        className="bg-[#052c65] p-2 text-xl text-white rounded"
      >
        Create Data
      </button>
      </div>
    </form>
  );
}

export default Add;
