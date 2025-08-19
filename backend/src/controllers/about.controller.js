import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { About } from "../models/about.model.js";

const create = asyncHandler(async (req, res) => {
  const {
    innovativeSmallText,
    innovativeHeader,
    innovativeDescription,
    innovativeIdeas,
    experienceYears,
    awards,
    projectsNumber,
    aboutAuthor,
    authorPosition,
    partnerHeader,
    partnerDescription,
  } = req.body;

  const files = req.files;

  // Check required fields
  if (
    !innovativeSmallText ||
    !innovativeHeader ||
    !innovativeDescription ||
    !experienceYears ||
    !awards ||
    !projectsNumber ||
    !aboutAuthor ||
    !authorPosition ||
    !partnerHeader ||
    !partnerDescription ||
    !innovativeIdeas
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existing = await About.findOne();
  if (existing) {
    throw new ApiError(409, "Data already exists");
  }
  // Convert file paths to URLs
  const fileToUrl = (file) => "/" + file.path.replace(/\\/g, "/");

  const aboutImageUrl =
    files?.aboutImage?.[0] && fileToUrl(files.aboutImage[0]);
  const aboutBannerImageUrl =
    files?.aboutBannerImage?.[0] && fileToUrl(files.aboutBannerImage[0]);

  const partnerImageUrls =
    files?.partnerImages?.map((file) => fileToUrl(file)) || [];

  // Parse innovativeIdeas from JSON string
  let parsedIdeas;
  try {
    parsedIdeas = JSON.parse(innovativeIdeas); // array of objects
  } catch (error) {
    throw new ApiError(400, "Invalid innovativeIdeas format");
  }

  // Handle idea images (which are flat but belong to different ideas)
  const ideaImages = files?.ideaImage || [];

  // Assign images back to respective innovativeIdeas
  parsedIdeas = parsedIdeas.map((idea, index) => {
    const relatedImage = ideaImages.find((img) =>
      img.originalname.startsWith(`idea-${index}-`)
    );
    return {
      ...idea,
      ideaImage: relatedImage ? fileToUrl(relatedImage) : "",
    };
  });
  // Create and save the document
  const about = await About.create({
    innovativeSmallText,
    innovativeHeader,
    innovativeDescription,
    innovativeIdeas: parsedIdeas,
    experienceYears,
    awards,
    projectsNumber,
    aboutAuthor,
    authorPosition,
    partnerHeader,
    partnerDescription,
    aboutImage: aboutImageUrl,
    aboutBannerImage: aboutBannerImageUrl,
    partnerImages: partnerImageUrls,
  });

  res.status(201).json({
    success: true,
    data: about,
  });
});

const read = asyncHandler(async (req, res) => {
  const data = await About.find();
  console.log("data", data);
  if (!data) {
    throw new ApiError(404, "Data not found in database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Data fetched succcessfully"));
});

const update = asyncHandler(async (req, res) => {
  const existing = await About.findOne();
  if (!existing) {
    throw new ApiError(404, "No data found to update");
  }

  const updatedFields = { ...req.body };
  const files = req.files;
  const fileToUrl = (file) => "/" + file.path.replace(/\\/g, "/");

  if (files?.aboutImage?.[0]) {
    updatedFields.aboutImage = fileToUrl(files.aboutImage[0]);
  }
  if (files?.aboutBannerImage?.[0]) {
    updatedFields.aboutBannerImage = fileToUrl(files.aboutBannerImage[0]);
  }
  if (files?.partnerImages?.length) {
    updatedFields.partnerImages = files.partnerImages.map(fileToUrl);
  }

  if (req.body.innovativeIdeas) {
    const parsedIdeas = JSON.parse(req.body.innovativeIdeas);
    const ideaImages = files?.ideaImage || [];

    const enrichedIdeas = parsedIdeas.map((idea, index) => {
      const image = ideaImages.find((img) =>
        img.originalname.startsWith(`idea-${index}-`)
      );
      return {
        ...idea,
        ideaImage: image
          ? fileToUrl(image)
          : existing.innovativeIdeas?.[index]?.ideaImage || "",
      };
    });

    updatedFields.innovativeIdeas = enrichedIdeas;
  }

  await About.findByIdAndUpdate(existing._id, updatedFields, { new: true });

  res
    .status(200)
    .json({ success: true, message: "About updated successfully" });
});

const deleteOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    fields = [],
    ideaImages = [],
    deleteAboutImage = false,
    deleteAboutBannerImage = false,
    deletePartnerImages = [],
  } = req.body;

  const about = await About.findById(id);
  if (!about) {
    throw new ApiError(404, "About not found");
  }

  // ✅ Delete fields by checking if field is included in `fields[]`
  if (fields.includes("innovativeSmallText")) about.innovativeSmallText = "";
  if (fields.includes("innovativeHeader")) about.innovativeHeader = "";
  if (fields.includes("innovativeDescription"))
    about.innovativeDescription = "";
  if (fields.includes("experienceYears")) about.experienceYears = 0;
  if (fields.includes("awards")) about.awards = 0;
  if (fields.includes("projectsNumber")) about.projectsNumber = 0;
  if (fields.includes("aboutAuthor")) about.aboutAuthor = "";
  if (fields.includes("authorPosition")) about.authorPosition = "";
  if (fields.includes("partnerHeader")) about.partnerHeader = "";
  if (fields.includes("partnerDescription")) about.partnerDescription = "";

  // ✅ Remove partnerImages by index
  if (Array.isArray(deletePartnerImages) && deletePartnerImages.length > 0) {
    about.partnerImages = about.partnerImages.filter(
      (_, idx) => !deletePartnerImages.includes(idx)
    );
  }

  // ✅ Remove ideaImages by index (removes whole idea entry)
  if (Array.isArray(ideaImages) && ideaImages.length > 0) {
    about.innovativeIdeas = about.innovativeIdeas.filter(
      (_, idx) => !ideaImages.includes(idx)
    );
  }

  // ✅ Remove main images
  if (deleteAboutImage) about.aboutImage = "";
  if (deleteAboutBannerImage) about.aboutBannerImage = "";

  await about.save();

  res
    .status(200)
    .json(new ApiResponse(200, about, "Selected fields deleted successfully"));
});

const deleteAll = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedDoc = await About.findByIdAndDelete(id);

  if (!deletedDoc) {
    throw new ApiError(404, "Document not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedDoc, "Entire document deleted"));
});

export { create, read, update, deleteAll, deleteOne };
