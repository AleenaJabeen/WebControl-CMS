import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Life } from "../models/life.model.js";

const create = asyncHandler(async (req, res) => {
  const { body, files } = req;

  // ✅ Get life image
  const lifeImageFile = files.find(f => f.fieldname === "lifeImage");
  if (!lifeImageFile) {
    throw new ApiError(400, "Life image is required");
  }
  const lifeImageUrl = "/" + lifeImageFile.path.replace(/\\/g, "/");

  // ✅ Parse memories JSON
  let parsedMemories;
  try {
    parsedMemories = JSON.parse(body.memories);
  } catch (e) {
    throw new ApiError(400, "Invalid memories JSON");
  }

  if (!Array.isArray(parsedMemories) || parsedMemories.length === 0) {
    throw new ApiError(400, "At least one memory is required");
  }

  // ✅ Match images to memories using imageCount
  let imageIndex = 0;
  const memoryData = parsedMemories.map((mem) => {
    const images = files
      .filter((f) => f.fieldname === "images")
      .slice(imageIndex, imageIndex + mem.imageCount)
      .map((f) => "/" + f.path.replace(/\\/g, "/"));

    imageIndex += mem.imageCount;

    return {
      name: mem.name,
      images,
    };
  });

  // ✅ Save to DB
  const newEntry = await Life.create({
    lifeImage: lifeImageUrl,
    memories: memoryData,
  });

  return res
    .status(201)
    .json(new ApiResponse(200, newEntry, "Life data created"));
});

const read = asyncHandler(async (req, res) => {
  const life = await Life.findOne(); // fetch the only life document

  if (!life) {
    throw new ApiError(404, "Life data not found");
  }

  return res.status(200).json(
    new ApiResponse(200, life, "Life data fetched successfully")
  );
});

const update = asyncHandler(async (req, res) => {
  const life = await Life.findById(req.params.id);
  if (!life) throw new ApiError(404, "Life data not found");

  const parsedMemories = JSON.parse(req.body.memories || "[]");

  // Group files by their fieldname
  const groupedFiles = {};
  for (const file of req.files) {
    if (!groupedFiles[file.fieldname]) {
      groupedFiles[file.fieldname] = [];
    }
    groupedFiles[file.fieldname].push("/" + file.path.replace(/\\/g, "/"));
  }

  const updatedMemories = parsedMemories.map((mem, index) => {
    const newImages = groupedFiles[`memoryImages-${index}`] || [];
    const existingImages = mem.existingImages || [];

    return {
      name: mem.name || "",
      images: newImages.length > 0 ? newImages : existingImages,
    };
  });

  const lifeImage =
    groupedFiles["lifeImage"]?.[0] || life.lifeImage;

  const updated = await Life.findByIdAndUpdate(
    req.params.id,
    {
      lifeImage,
      memories: updatedMemories,
    },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updated, "Life updated successfully"));
});



const deleteOne = asyncHandler(async (req, res) => {
  const life = await Life.findById(req.params.id);
  if (!life) throw new ApiError(404, "Life data not found");

  const { memoryIndexesToDelete = [], memoryImagesToDelete = {} } = req.body;

  // Remove entire memory sections by index
  memoryIndexesToDelete.forEach((index) => {
    if (life.memories[index]) {
      life.memories.splice(index, 1);
    }
  });

  // Remove specific images from memories
  Object.entries(memoryImagesToDelete).forEach(([index, imagePaths]) => {
    const memory = life.memories[index];
    if (memory) {
      memory.images = memory.images.filter((img) => !imagePaths.includes(img));
    }
  });
  if (req.body.deleteLifeImage) {
  life.lifeImage = "";
}

  await life.save();

  res.status(200).json(new ApiResponse(200, life, "Selected fields deleted successfully"));
});

const deleteAll = asyncHandler(async (req, res) => {
  const life = await Life.findByIdAndDelete(req.params.id);

  if (!life) throw new ApiError(404, "Life data not found");

  res.status(200).json(new ApiResponse(200, null, "Life document deleted successfully"));
});




export { create,read,update,deleteAll ,deleteOne};
