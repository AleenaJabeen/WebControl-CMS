import React, { useContext, useState } from "react";
import axios from "axios";
import {DataContext} from '../../context/Context';

const Add = () => {
  const {setDataId}=useContext(DataContext);
  const [form, setForm] = useState({
    banner: [
      {
        imageUrl: null,
        heading: "",
        description: "",
        smallText: "",
      },
    ],
    footer: {
      logoUrl: null,
      footerDescription: "",
      usefulLinks: [{ label: "" }],
      contactInfo: {
        address: "",
        phone: "",
        email: "",
      },
      services: [""],
      socialLinks: [{ platform: "", url: "" }],
      companyMotto: "",
    },
    director: {
      directorText: "",
      directorName: "",
      directorQuote: "",
      directorSignature: null,
      directorImage: null,
      directorPosition: "",
    },
    header: {
      logo: null,
      favicon: null,
      navItems: [""],
      rightBtn: "",
      title: "",
    },
  });

  const isEmpty = (value) => {
    return (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "") ||
      (Array.isArray(value) && value.length === 0)
    );
  };

  const inputValidations = () => {
    if (!Array.isArray(form.banner) || form.banner.length === 0) return false;
    for (const item of form.banner) {
      if (
        isEmpty(item.imageUrl) ||
        isEmpty(item.heading) ||
        isEmpty(item.description) ||
        isEmpty(item.smallText)
      ) {
        return false;
      }
    }

    const f = form.footer;
    if (
      isEmpty(f.logoUrl) ||
      isEmpty(f.footerDescription) ||
      isEmpty(f.companyMotto) ||
      isEmpty(f.contactInfo.address) ||
      isEmpty(f.contactInfo.phone) ||
      isEmpty(f.contactInfo.email) ||
      f.usefulLinks.some((l) => isEmpty(l.label)) ||
      f.services.some((s) => isEmpty(s)) ||
      f.socialLinks.some((l) => isEmpty(l.platform) || isEmpty(l.url))
    ) {
      return false;
    }

    const d = form.director;
    if (
      isEmpty(d.directorName) ||
      isEmpty(d.directorQuote) ||
      isEmpty(d.directorText) ||
      isEmpty(d.directorPosition) ||
      isEmpty(d.directorSignature) ||
      isEmpty(d.directorImage)
    ) {
      return false;
    }

    const h = form.header;
    if (
      isEmpty(h.logo) ||
      isEmpty(h.favicon) ||
      isEmpty(h.title) ||
      isEmpty(h.rightBtn) ||
      h.navItems.some((item) => isEmpty(item))
    ) {
      return false;
    }

    return true;
  };

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

  const formToFormData = (form) => {
  const formData = new FormData();

  // Banner text fields
  form.banner.forEach((item, i) => {
    formData.append(`banner[${i}][heading]`, item.heading);
    formData.append(`banner[${i}][description]`, item.description);
    formData.append(`banner[${i}][smallText]`, item.smallText);

    if (item.imageUrl) {
      formData.append("imageUrl", item.imageUrl); // 👈 send image with field name Multer expects
    }
  });

  // Footer
  formData.append("footer[footerDescription]", form.footer.footerDescription);
  formData.append("footer[companyMotto]", form.footer.companyMotto);
  form.footer.usefulLinks.forEach((link, i) => {
    formData.append(`footer[usefulLinks][${i}][label]`, link.label);
  });
  formData.append("footer[contactInfo][address]", form.footer.contactInfo.address);
  formData.append("footer[contactInfo][phone]", form.footer.contactInfo.phone);
  formData.append("footer[contactInfo][email]", form.footer.contactInfo.email);
  form.footer.services.forEach((srv, i) => {
    formData.append(`footer[services][${i}]`, srv);
  });
  form.footer.socialLinks.forEach((link, i) => {
    formData.append(`footer[socialLinks][${i}][platform]`, link.platform);
    formData.append(`footer[socialLinks][${i}][url]`, link.url);
  });

  if (form.footer.logoUrl) {
    formData.append("logoUrl", form.footer.logoUrl); // 👈 match multer
  }

  // Director
  formData.append("director[directorText]", form.director.directorText);
  formData.append("director[directorName]", form.director.directorName);
  formData.append("director[directorQuote]", form.director.directorQuote);
  formData.append("director[directorPosition]", form.director.directorPosition);

  if (form.director.directorImage) {
    formData.append("directorImage", form.director.directorImage); // 👈 match multer
  }
  if (form.director.directorSignature) {
    formData.append("directorSignature", form.director.directorSignature); // 👈 match multer
  }

  // Header
  formData.append("header[title]", form.header.title);
  formData.append("header[rightBtn]", form.header.rightBtn);
  form.header.navItems.forEach((item, i) => {
    formData.append(`header[navItems][${i}]`, item);
  });

  if (form.header.logo) {
    formData.append("logo", form.header.logo); // ❗ already used for footer.logoUrl – avoid conflict
  }

  if (form.header.favicon) {
    formData.append("favicon", form.header.favicon); // 👈 match multer
  }

  return formData;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValidations()) {
      return alert("Please fill all fields.");
    }
    try {
      const data = formToFormData(form);
      const response=await axios.post("http://localhost:8080/api/v1/home/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      // setDataId(response.data.data._id);
      console.log(setDataId)
      alert("Submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting data.");
    }
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

  

  return (
    <form onSubmit={handleSubmit} className="p-4 text-[#052c65] space-y-8">

      {/* ✅ BANNER SECTION */}
      <section>
        <h2 className="text-xl font-bold mb-4 bg-[#052c65] text-white p-2 rounded">Banner</h2>
        {form.banner.map((b, i) => (
          <div key={i} className="space-y-2 mb-4 border p-4 rounded">
            <input type="file" onChange={(e) => handleChange(`banner.${i}.imageUrl`, e.target.files[0])} />
            <input placeholder="Heading" value={b.heading} onChange={(e) => handleChange(`banner.${i}.heading`, e.target.value)} className="block w-full p-2 border rounded" />
            <input placeholder="Description" value={b.description} onChange={(e) => handleChange(`banner.${i}.description`, e.target.value)} className="block w-full p-2 border rounded" />
            <input placeholder="Small Text" value={b.smallText} onChange={(e) => handleChange(`banner.${i}.smallText`, e.target.value)} className="block w-full p-2 border rounded" />
            {form.banner.length > 1 && (
              <button type="button" className="text-red-500" onClick={() => removeArrayItem("banner", i)}>Remove</button>
            )}
          </div>
        ))}
        <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => addArrayItem("banner", { imageUrl: null, heading: "", description: "", smallText: "" })}>Add Banner</button>
      </section>

      {/* ✅ FOOTER SECTION */}
      <section>
        <h2 className="text-xl font-bold mb-4 bg-[#052c65] text-white p-2 rounded">Footer</h2>
        <input type="file" onChange={(e) => handleChange("footer.logoUrl", e.target.files[0])} />
        <input placeholder="Footer Description" value={form.footer.footerDescription} onChange={(e) => handleChange("footer.footerDescription", e.target.value)} className="block w-full p-2 border rounded" />
        <input placeholder="Company Motto" value={form.footer.companyMotto} onChange={(e) => handleChange("footer.companyMotto", e.target.value)} className="block w-full p-2 border rounded" />
        <input placeholder="Address" value={form.footer.contactInfo.address} onChange={(e) => handleChange("footer.contactInfo.address", e.target.value)} className="block w-full p-2 border rounded" />
        <input placeholder="Phone" value={form.footer.contactInfo.phone} onChange={(e) => handleChange("footer.contactInfo.phone", e.target.value)} className="block w-full p-2 border rounded" />
        <input placeholder="Email" value={form.footer.contactInfo.email} onChange={(e) => handleChange("footer.contactInfo.email", e.target.value)} className="block w-full p-2 border rounded" />

        <h4 className="font-semibold mt-4">Useful Links</h4>
        {form.footer.usefulLinks.map((link, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input value={link.label} onChange={(e) => handleChange(`footer.usefulLinks.${i}.label`, e.target.value)} placeholder="Label" className="p-2 border rounded flex-1" />
            <button type="button" onClick={() => removeArrayItem("footer.usefulLinks", i)} className="text-red-500">❌</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem("footer.usefulLinks", { label: "" })} className="text-sm text-blue-600 underline">+ Add Useful Link</button>

        <h4 className="font-semibold mt-4">Services</h4>
        {form.footer.services.map((s, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input value={s} onChange={(e) => handleChange(`footer.services.${i}`, e.target.value)} placeholder="Service" className="p-2 border rounded flex-1" />
            <button type="button" onClick={() => removeArrayItem("footer.services", i)} className="text-red-500">❌</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem("footer.services", "")} className="text-sm text-blue-600 underline">+ Add Service</button>

        <h4 className="font-semibold mt-4">Social Links</h4>
        {form.footer.socialLinks.map((s, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input value={s.platform} onChange={(e) => handleChange(`footer.socialLinks.${i}.platform`, e.target.value)} placeholder="Platform" className="p-2 border rounded" />
            <input value={s.url} onChange={(e) => handleChange(`footer.socialLinks.${i}.url`, e.target.value)} placeholder="URL" className="p-2 border rounded" />
            <button type="button" onClick={() => removeArrayItem("footer.socialLinks", i)} className="text-red-500">❌</button>
          </div>
        ))}
        <button type="button" onClick={() => addArrayItem("footer.socialLinks", { platform: "", url: "" })} className="text-sm text-blue-600 underline">+ Add Social Link</button>
      </section>
{/* ✅ DIRECTOR SECTION */}
<section>
  <h2 className="text-xl font-bold mb-4 bg-[#052c65] text-white p-2 rounded">Director</h2>
  <input
    placeholder="Director Name"
    value={form.director.directorName}
    onChange={(e) => handleChange("director.directorName", e.target.value)}
    className="block w-full p-2 border rounded mb-2"
  />
  <input
    placeholder="Director Position"
    value={form.director.directorPosition}
    onChange={(e) => handleChange("director.directorPosition", e.target.value)}
    className="block w-full p-2 border rounded mb-2"
  />
  <input
    placeholder="Director Quote"
    value={form.director.directorQuote}
    onChange={(e) => handleChange("director.directorQuote", e.target.value)}
    className="block w-full p-2 border rounded mb-2"
  />
  <textarea
    placeholder="Director Text"
    value={form.director.directorText}
    onChange={(e) => handleChange("director.directorText", e.target.value)}
    className="block w-full p-2 border rounded mb-2"
  ></textarea>
  <label className="block mb-2">Director Signature:</label>
  <input
    type="file"
    onChange={(e) => handleChange("director.directorSignature", e.target.files[0])}
    className="mb-4"
  />
  <label className="block mb-2">Director Image:</label>
  <input
    type="file"
    onChange={(e) => handleChange("director.directorImage", e.target.files[0])}
  />
</section>

{/* ✅ HEADER SECTION */}
<section>
  <h2 className="text-xl font-bold mb-4 bg-[#052c65] text-white p-2 rounded">Header</h2>
  <label className="block mb-2">Logo:</label>
  <input
    type="file"
    onChange={(e) => handleChange("header.logo", e.target.files[0])}
    className="mb-4"
  />
  <label className="block mb-2">Favicon:</label>
  <input
    type="file"
    onChange={(e) => handleChange("header.favicon", e.target.files[0])}
    className="mb-4"
  />
  <input
    placeholder="Header Title"
    value={form.header.title}
    onChange={(e) => handleChange("header.title", e.target.value)}
    className="block w-full p-2 border rounded mb-2"
  />
  <input
    placeholder="Right Button Text"
    value={form.header.rightBtn}
    onChange={(e) => handleChange("header.rightBtn", e.target.value)}
    className="block w-full p-2 border rounded mb-2"
  />

  <h4 className="font-semibold mt-4">Nav Items</h4>
  {form.header.navItems.map((item, i) => (
    <div key={i} className="flex items-center gap-2 mb-2">
      <input
        value={item}
        onChange={(e) => handleChange(`header.navItems.${i}`, e.target.value)}
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
    className="text-sm text-blue-600 underline"
  >
    + Add Nav Item
  </button>
</section>


      <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded mx-auto block">Submit</button>
    </form>
  );
};

export default Add;
