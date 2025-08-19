import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Contact } from "../models/contact.model.js";

const create = asyncHandler(async (req, res) => {
  const { whatsappNumber, fields, contactInfo, openTime, socialLinks } =
    req.body;
  if (
    whatsappNumber === "" ||
    fields.length === 0 ||
    openTime === "" ||
    Object.keys(contactInfo).length === 0 ||
    socialLinks.length === 0
  ) {
    throw new ApiError(404, "All fields are required");
  }
  const contactLocalPath = req.file?.path;
  const contactUrl = "/" + contactLocalPath.replace(/\\/g, "/");

  const existing = await Contact.findOne();
  if (existing) {
    throw new ApiError(409, "Data already exists");
  }

  const contact = await Contact.create({
    openTime,
    whatsappNumber,
    fields: JSON.parse(fields),
    socialLinks: JSON.parse(socialLinks),
    contactInfo: JSON.parse(contactInfo),
    contactImage: contactUrl,
  });

  if (!contact) {
    throw new ApiError(500, "Error while saving data in database");
  }

  return res.status(201).json(new ApiResponse(200, contact, "Data is created"));
});

const read = asyncHandler(async (req, res) => {
  const data = await Contact.find();
//   console.log("data", data);
  if (!data) {
    throw new ApiError(404, "Data not found in database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Data fetched succcessfully"));
});


const update = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne();
  if (!contact) {
    throw new ApiError(404, "Contact data not found");
  }

  const updateData = {};

  if (req.body.whatsappNumber) updateData.whatsappNumber = req.body.whatsappNumber;
  if (req.body.openTime) updateData.openTime = req.body.openTime;
  if (req.body.fields) updateData.fields = JSON.parse(req.body.fields);
  if (req.body.socialLinks) updateData.socialLinks = JSON.parse(req.body.socialLinks);
  if (req.body.contactInfo) updateData.contactInfo = JSON.parse(req.body.contactInfo);

  if (req.file) {
    const imagePath = "/" + req.file.path.replace(/\\/g, "/");
    updateData.contactImage = imagePath;
  }

  const updated = await Contact.findByIdAndUpdate(contact._id, updateData, {
    new: true,
  });

  return res.status(200).json(new ApiResponse(200, updated, "Contact updated successfully"));
});

const deleteOne= asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { socialLinks = [], fields = [], contactInfo = [] , deleteContactImage = false,
    deleteWhatsappNumber = false,
    deleteOpenTime = false,} = req.body;
    console.log(req.body);

  const contact = await Contact.findById(id);
  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  // Remove selected socialLinks
  if (Array.isArray(socialLinks)) {
    contact.socialLinks = contact.socialLinks.filter((_, idx) => !socialLinks.includes(idx));
  }

  // Remove selected fields
  if (Array.isArray(fields)) {
    contact.fields = contact.fields.filter((_, idx) => !fields.includes(idx));
  }

  // Remove keys from contactInfo
  if (Array.isArray(contactInfo)) {
    for (let key of contactInfo) {
      delete contact.contactInfo[key];
    }
  }
  if (deleteContactImage) {
    contact.contactImage = "";
    // Optional: fs.unlink(...) to delete file
  }

  // Remove whatsappNumber
  if (deleteWhatsappNumber) {
    contact.whatsappNumber = "";
  }

  // Remove openTime
  if (deleteOpenTime) {
    contact.openTime = "";
  }

  await contact.save();

  res.status(200).json(new ApiResponse(200, contact, "Selected fields deleted"));
});
const deleteAll = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedDoc = await Contact.findByIdAndDelete(id);

  if (!deletedDoc) {
    throw new ApiError(404, "Document not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedDoc, "Entire document deleted"));
});




export { create,read,update ,deleteOne,deleteAll};
