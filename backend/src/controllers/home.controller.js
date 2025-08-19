import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Home } from "../models/home.model.js";


const create = asyncHandler(async (req, res) => {
  try {
    // Step 1: Get raw fields from req.body (already parsed by multer)
    const banner = req.body.banner;
    const footer = req.body.footer;
    const director = req.body.director;
    const header = req.body.header;

    // If these were sent as strings from frontend, parse them
    const parsedBanner = typeof banner === "string" ? JSON.parse(banner) : banner;
    const parsedFooter = typeof footer === "string" ? JSON.parse(footer) : footer;
    const parsedDirector = typeof director === "string" ? JSON.parse(director) : director;
    const parsedHeader = typeof header === "string" ? JSON.parse(header) : header;

    // Validation
    if (!parsedBanner || !parsedFooter || !parsedDirector || !parsedHeader) {
      throw new ApiError(400, "All fields are required");
    }

    // Step 2: Handle uploaded files (via multer)
    const files = req.files;

    // Header images
    const logo = files?.logo?.[0]?.path?.replace(/\\/g, "/");
    const favicon = files?.favicon?.[0]?.path?.replace(/\\/g, "/");

    if (!logo || !favicon) {
      throw new ApiError(400, "Logo and Favicon are required");
    }

    parsedHeader.logo = "/" + logo;
    parsedHeader.favicon = "/" + favicon;

    // Director images
    const directorImage = files?.directorImage?.[0]?.path?.replace(/\\/g, "/");
    const directorSignature = files?.directorSignature?.[0]?.path?.replace(/\\/g, "/");

    if (!directorImage || !directorSignature) {
      throw new ApiError(400, "Director image and signature are required");
    }

    parsedDirector.directorImage = "/" + directorImage;
    parsedDirector.directorSignature = "/" + directorSignature;

    // footer logo url 
     const logoUrl = files?.logoUrl?.[0]?.path?.replace(/\\/g, "/");

     if (!logoUrl) {
      throw new ApiError(400, "Logo url for footer are required");
    }
    parsedFooter.logoUrl = "/" + logoUrl;

    // Banner images – match by index
    parsedBanner.forEach((item, index) => {
      const imageFieldName = `imageUrl`;
      const file = files[imageFieldName]?.[index];
      if (!file) {
        throw new ApiError(400, `Missing banner image at index ${index}`);
      }
      item.imageUrl = "/" + file.path.replace(/\\/g, "/");
    });

    // Optional: Prevent duplicate data
    const existing = await Home.findOne();
    if (existing) {
      return res.status(400).json({ message: "Home data already exists." });
    }

    // Step 3: Save to DB
    const data = await Home.create({
      banner: parsedBanner,
      footer: parsedFooter,
      director: parsedDirector,
      header: parsedHeader,
    });

    return res
      .status(201)
      .json(new ApiResponse(201, data, "Home data saved successfully"));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal Server Error");
  }
});

const read = asyncHandler(async (req, res) => {
  try {
    const homeData = await Home.find();

    if (!homeData) {
      throw new ApiError(404, "Home data not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, homeData, "Home data fetched successfully"));
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Internal Server Error");
  }
});

// controller/homeController.js


const update = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const files = req.files;

  const existing = await Home.findById(id);
  if (!existing) throw new ApiError(404, "Home document not found");

  const updateData = {};

  const parse = (field) =>
    typeof field === "string" ? JSON.parse(field) : field;

  const mergeUsefulLinks = (existingLinks = [], newLinks = []) => {
    const map = new Map();
    for (const link of existingLinks) map.set(link.label, link);
    for (const newLink of newLinks) {
      map.set(newLink.label, { ...map.get(newLink.label), ...newLink });
    }
    return Array.from(map.values());
  };

  // Merge banner
  if (body.banner) {
    const newBanner = parse(body.banner);
    updateData.banner = newBanner.map((item, index) => {
      const file = files?.imageUrl?.[index];
      return {
        ...existing.banner?.[index]?.toObject?.(),
        ...item,
        imageUrl: file
          ? "/" + file.path.replace(/\\/g, "/")
          : existing.banner?.[index]?.imageUrl || null,
      };
    });
  }

  // Merge footer
  if (body.footer) {
    const incomingFooter = parse(body.footer);
    updateData.footer = {
      ...(existing.footer?.toObject?.() || {}),
      ...incomingFooter,
    };
    if (incomingFooter.usefulLinks) {
      updateData.footer.usefulLinks = mergeUsefulLinks(
        existing.footer?.usefulLinks || [],
        incomingFooter.usefulLinks
      );
    }
  }

  // Merge director
  if (body.director) {
    const incoming = parse(body.director);
    updateData.director = {
      ...(existing.director?.toObject?.() || {}),
      ...incoming,
    };
  }

  // Merge header
  if (body.header) {
    const incoming = parse(body.header);
    updateData.header = {
      ...(existing.header?.toObject?.() || {}),
      ...incoming,
    };
  }

  // Handle Files
  if (files?.logoUrl?.[0]) {
    updateData.footer = updateData.footer || {};
    updateData.footer.logoUrl = "/" + files.logoUrl[0].path.replace(/\\/g, "/");
  }

  if (files?.logo?.[0]) {
    updateData.header = updateData.header || {};
    updateData.header.logo = "/" + files.logo[0].path.replace(/\\/g, "/");
  }

  if (files?.favicon?.[0]) {
    updateData.header = updateData.header || {};
    updateData.header.favicon = "/" + files.favicon[0].path.replace(/\\/g, "/");
  }

  if (files?.directorImage?.[0]) {
    updateData.director = updateData.director || {};
    updateData.director.directorImage =
      "/" + files.directorImage[0].path.replace(/\\/g, "/");
  }

  if (files?.directorSignature?.[0]) {
    updateData.director = updateData.director || {};
    updateData.director.directorSignature =
      "/" + files.directorSignature[0].path.replace(/\\/g, "/");
  }

  const updated = await Home.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  res
    .status(200)
    .json(new ApiResponse(200, updated, "Home data updated successfully"));
});




// controllers/home.controller.js



const deleteOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sections } = req.body;

  if (!id) {
    throw new ApiError(400, "Home document ID is required.");
  }

  if (!Array.isArray(sections) || sections.length === 0) {
    throw new ApiError(400, "Sections must be a non-empty array.");
  }

  // Convert to MongoDB unset format
  const unsetObject = {};
  sections.forEach((section) => {
    unsetObject[section] = "";
  });

  const updatedDoc = await Home.findByIdAndUpdate(
    id,
    { $unset: unsetObject },
    { new: true }
  );

  if (!updatedDoc) {
    throw new ApiError(404, "Home document not found");
  }

  res.status(200).json(
    new ApiResponse(200, updatedDoc, "Selected sections deleted successfully")
  );
});





const deleteAll = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedDoc = await Home.findByIdAndDelete(id);

  if (!deletedDoc) {
    throw new ApiError(404, "Home document not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedDoc, "Home document deleted successfully"));
});





export {create,update,deleteAll,read,deleteOne}