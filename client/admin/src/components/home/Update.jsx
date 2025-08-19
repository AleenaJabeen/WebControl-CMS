import React, { useEffect, useState } from "react";
import axios from "axios";

const Update = () => {
  const [dataId, setDataId] = useState(null);
  const [form, setForm] = useState(null);

  // Generic field update
  const handleChange = (path, value) => {
    setForm((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let ref = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        ref = ref[keys[i]];
      }
      ref[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const addArrayItem = (path, defaultValue) => {
    const keys = path.split(".");
    const list = keys.reduce((obj, key) => obj[key], form);
    const updatedList = [...list, defaultValue];
    handleChange(path, updatedList);
  };

  const removeArrayItem = (path, index) => {
    const keys = path.split(".");
    const list = keys.reduce((obj, key) => obj[key], form);
    const updatedList = list.filter((_, i) => i !== index);
    handleChange(path, updatedList);
  };

  // Form -> FormData
  const formToFormData = (form) => {
    const formData = new FormData();

    formData.append("banner", JSON.stringify(form.banner));
    formData.append("footer", JSON.stringify(form.footer));
    formData.append("director", JSON.stringify(form.director));
    formData.append("header", JSON.stringify(form.header));

    form.banner.forEach((item, i) => {
      if (item.imageUrl instanceof File) {
        formData.append("imageUrl", item.imageUrl);
      }
    });

    if (form.footer.logoUrl instanceof File) {
      formData.append("logoUrl", form.footer.logoUrl);
    }
    if (form.director.directorImage instanceof File) {
      formData.append("directorImage", form.director.directorImage);
    }
    if (form.director.directorSignature instanceof File) {
      formData.append("directorSignature", form.director.directorSignature);
    }
    if (form.header.logo instanceof File) {
      formData.append("logo", form.header.logo);
    }
    if (form.header.favicon instanceof File) {
      formData.append("favicon", form.header.favicon);
    }

    return formData;
  };

  // Submit Handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const data = formToFormData(form);
      await axios.patch(
        `http://localhost:8080/api/v1/home/update/${dataId}`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      alert("Updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };

  // Load Existing Data
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:8080/api/v1/home/read");
      const existing = res.data.data[0];
      setDataId(existing._id);
      setForm(existing);
    };
    fetchData();
  }, []);

  if (!form) return <p className="p-4">Loading...</p>;

  return (
    <form onSubmit={handleUpdate} className="p-4 space-y-10">
      {/* ✅ Banner */}
      <section>
        <h2 className="text-xl font-bold">Banner</h2>
        {form.banner.map((item, i) => (
          <div key={i} className="space-y-2 border p-2 rounded mb-4">
            <input
              type="file"
              onChange={(e) =>
                handleChange(`banner.${i}.imageUrl`, e.target.files[0])
              }
            />
            <input
              value={item.heading}
              onChange={(e) =>
                handleChange(`banner.${i}.heading`, e.target.value)
              }
              placeholder="Heading"
              className="w-full p-2 border rounded"
            />
            <input
              value={item.description}
              onChange={(e) =>
                handleChange(`banner.${i}.description`, e.target.value)
              }
              placeholder="Description"
              className="w-full p-2 border rounded"
            />
            <input
              value={item.smallText}
              onChange={(e) =>
                handleChange(`banner.${i}.smallText`, e.target.value)
              }
              placeholder="Small Text"
              className="w-full p-2 border rounded"
            />
            {form.banner.length > 1 && (
              <button
                type="button"
                onClick={() => removeArrayItem("banner", i)}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addArrayItem("banner", {
              imageUrl: null,
              heading: "",
              description: "",
              smallText: "",
            })
          }
          className="text-blue-600 text-sm"
        >
          + Add Banner
        </button>
      </section>

      {/* ✅ Footer */}
      <section>
        <h2 className="text-xl font-bold">Footer</h2>
        <input
          type="file"
          onChange={(e) =>
            handleChange("footer.logoUrl", e.target.files[0])
          }
        />
        <input
          value={form.footer.footerDescription}
          onChange={(e) =>
            handleChange("footer.footerDescription", e.target.value)
          }
          placeholder="Footer Description"
          className="w-full p-2 border rounded"
        />
        <input
          value={form.footer.companyMotto}
          onChange={(e) =>
            handleChange("footer.companyMotto", e.target.value)
          }
          placeholder="Company Motto"
          className="w-full p-2 border rounded"
        />
        {/* Contact Info */}
        <input
          value={form.footer.contactInfo.address}
          onChange={(e) =>
            handleChange("footer.contactInfo.address", e.target.value)
          }
          placeholder="Address"
          className="w-full p-2 border rounded"
        />
        <input
          value={form.footer.contactInfo.phone}
          onChange={(e) =>
            handleChange("footer.contactInfo.phone", e.target.value)
          }
          placeholder="Phone"
          className="w-full p-2 border rounded"
        />
        <input
          value={form.footer.contactInfo.email}
          onChange={(e) =>
            handleChange("footer.contactInfo.email", e.target.value)
          }
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        {/* Useful Links */}
        <h4 className="font-semibold mt-4">Useful Links</h4>
        {form.footer.usefulLinks.map((link, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <input
              value={link.label}
              onChange={(e) =>
                handleChange(`footer.usefulLinks.${i}.label`, e.target.value)
              }
              placeholder="Label"
              className="p-2 border rounded flex-1"
            />
            <button
              type="button"
              onClick={() => removeArrayItem("footer.usefulLinks", i)}
              className="text-red-500"
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("footer.usefulLinks", { label: "" })}
          className="text-blue-600 text-sm"
        >
          + Add Useful Link
        </button>

        {/* Services */}
        <h4 className="font-semibold mt-4">Services</h4>
        {form.footer.services.map((s, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <input
              value={s}
              onChange={(e) =>
                handleChange(`footer.services.${i}`, e.target.value)
              }
              placeholder="Service"
              className="p-2 border rounded flex-1"
            />
            <button
              type="button"
              onClick={() => removeArrayItem("footer.services", i)}
              className="text-red-500"
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("footer.services", "")}
          className="text-blue-600 text-sm"
        >
          + Add Service
        </button>

        {/* Social Links */}
        <h4 className="font-semibold mt-4">Social Links</h4>
        {form.footer.socialLinks.map((s, i) => (
          <div key={i} className="flex gap-2 items-center mb-2">
            <input
              value={s.platform}
              onChange={(e) =>
                handleChange(`footer.socialLinks.${i}.platform`, e.target.value)
              }
              placeholder="Platform"
              className="p-2 border rounded"
            />
            <input
              value={s.url}
              onChange={(e) =>
                handleChange(`footer.socialLinks.${i}.url`, e.target.value)
              }
              placeholder="URL"
              className="p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => removeArrayItem("footer.socialLinks", i)}
              className="text-red-500"
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            addArrayItem("footer.socialLinks", { platform: "", url: "" })
          }
          className="text-blue-600 text-sm"
        >
          + Add Social Link
        </button>
      </section>

      {/* ✅ Director */}
      <section>
        <h2 className="text-xl font-bold">Director</h2>
        <input
          type="file"
          onChange={(e) =>
            handleChange("director.directorImage", e.target.files[0])
          }
        />
        <input
          type="file"
          onChange={(e) =>
            handleChange("director.directorSignature", e.target.files[0])
          }
        />
        <input
          value={form.director.directorName}
          onChange={(e) =>
            handleChange("director.directorName", e.target.value)
          }
          placeholder="Name"
          className="w-full p-2 border rounded"
        />
        <input
          value={form.director.directorPosition}
          onChange={(e) =>
            handleChange("director.directorPosition", e.target.value)
          }
          placeholder="Position"
          className="w-full p-2 border rounded"
        />
        <input
          value={form.director.directorQuote}
          onChange={(e) =>
            handleChange("director.directorQuote", e.target.value)
          }
          placeholder="Quote"
          className="w-full p-2 border rounded"
        />
        <textarea
          value={form.director.directorText}
          onChange={(e) =>
            handleChange("director.directorText", e.target.value)
          }
          placeholder="Text"
          className="w-full p-2 border rounded"
        />
      </section>

      {/* ✅ Header */}
      <section>
        <h2 className="text-xl font-bold">Header</h2>
        <input
          type="file"
          onChange={(e) => handleChange("header.logo", e.target.files[0])}
        />
        <input
          type="file"
          onChange={(e) => handleChange("header.favicon", e.target.files[0])}
        />
        <input
          value={form.header.title}
          onChange={(e) => handleChange("header.title", e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <input
          value={form.header.rightBtn}
          onChange={(e) => handleChange("header.rightBtn", e.target.value)}
          placeholder="Right Button"
          className="w-full p-2 border rounded"
        />
        <h4 className="font-semibold mt-4">Nav Items</h4>
        {form.header.navItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              value={item}
              onChange={(e) =>
                handleChange(`header.navItems.${i}`, e.target.value)
              }
              placeholder="Nav Item"
              className="p-2 border rounded flex-1"
            />
            <button
              type="button"
              onClick={() => removeArrayItem("header.navItems", i)}
              className="text-red-500"
            >
              ❌
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addArrayItem("header.navItems", "")}
          className="text-blue-600 text-sm"
        >
          + Add Nav Item
        </button>
      </section>

      <button
        type="submit"
        className="bg-green-600 text-white py-2 px-6 rounded"
      >
        Update
      </button>
    </form>
  );
};

export default Update;
