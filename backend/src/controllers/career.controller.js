import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Career } from "../models/career.model.js";

const create = asyncHandler(async (req, res) => {
  // get the data from req body
  const { jobs, fields } = req.body;
  // console.log("data",siteTitle);
  // check if data exists
  if (jobs === null || fields === null) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("job", jobs);
  console.log("career", fields);
  // check for images
  const careerLocalPath = req.file?.path;
  const careerUrl = "/" + careerLocalPath.replace(/\\/g, "/");
  console.log(careerLocalPath);

  const existing = await Career.findOne();
  if (existing) {
    return res.status(400).json({ message: "Career data already exists." });
  }

  if (!careerLocalPath) {
    throw new ApiError(400, "Career Banner Image is required");
  }
  // add the url to database
  const data = await Career.create({
    jobs: JSON.parse(jobs),
    fields: JSON.parse(fields),
    careerImage: careerUrl,
  });
  console.log("data", data);
  if (!data) {
    throw new ApiError(500, "Career data not saved in database");
  }
  // return the response to user if data is saved
  return res
    .status(201)
    .json(new ApiResponse(200, data, "Career data  is saved"));
});

const read = asyncHandler(async (req, res) => {
  const data = await Career.find();
  console.log("data", data);
  if (!data) {
    throw new ApiError(404, "Data not found in database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Data fetched succcessfully"));
});

const updateOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateFields = {};

  if (req.body.jobs) {
    updateFields.jobs = JSON.parse(req.body.jobs);
  }

  if (req.body.fields) {
    updateFields.fields = JSON.parse(req.body.fields);
  }

  if (req.file?.path) {
    updateFields.careerImage = "/" + req.file?.path.replace(/\\/g, "/");
  }

  const updated = await Career.findByIdAndUpdate(id, updateFields, {
    new: true,
  });

  if (!updated) {
    throw new ApiError(404, "Document not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updated, "Career data Updated successfully"));
});

const updateAll = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = {
    jobs: JSON.parse(req.body.jobs),
    fields: JSON.parse(req.body.fields),
  };

  if (req.file?.path) {
    updates.careerImage = "/" + req.file?.path.replace(/\\/g, "/");
  }

  const updatedData = await Career.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!updatedData) {
    throw new ApiError(404, "Career Data not found");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedData, "Career Data updated successfully")
    );
});

const deleteOne = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const fieldsToDelete = {};
  console.log("re", req.body);

  if (req.body.jobs) {
    fieldsToDelete.jobs = null; // This field will be removed
  }

  if (req.body.fields) {
    fieldsToDelete.fields = null; // Unset navItems
  }

  if (req.file?.path) {
    fieldsToDelete.careerImage = ""; // Unset logo
  }

  if (Object.keys(fieldsToDelete).length === 0) {
    throw new ApiError(400, "No fields specified for deletion");
  }

  const updated = await Career.findByIdAndUpdate(
    id,
    { $unset: fieldsToDelete },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(404, "Document not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updated, "Fields deleted successfully"));
});

const deleteAll = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedDoc = await Career.findByIdAndDelete(id);

  if (!deletedDoc) {
    throw new ApiError(404, "Document not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedDoc, "Entire document deleted"));
});

export { create, read, updateOne, updateAll, deleteOne, deleteAll };
