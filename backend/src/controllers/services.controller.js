import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Service } from "../models/services.model.js";

const create = asyncHandler(async (req, res) => {
  const {serviceHeader,servicesDescription,services,toolHeading,tools } = req.body;

  if (serviceHeader === "" || servicesDescription === "" || services.length===0 || toolHeading==="" || tools.length===0) {
    throw new ApiError(400, "All fields are required");
  }
  
   const files = req.files;
    const fileToUrl = (file) => "/" + file.path.replace(/\\/g, "/");
     const serviceUrl = files?.serviceImage?.[0] && fileToUrl(files.serviceImage[0]);
     
     
let parsedTools;
  try {
    parsedTools = JSON.parse(tools); // array of objects
  } catch (error) {
    throw new ApiError(400, "Invalid tools format");
  }
 const toolImages = files?.toolImage || [];

 parsedTools = parsedTools.map((tool, index) => {
  const relatedImage = toolImages.find((img) =>
    img.originalname.startsWith(`tool-${index}-`)
  );
   return {
    ...tool,
    toolImage: relatedImage ? fileToUrl(relatedImage) : "",
  };
});

let parsedServices;
  try {
    parsedServices = JSON.parse(services); // array of objects
  } catch (error) {
    throw new ApiError(400, "Invalid services format");
  }
 const serviceImages = files?.image || [];

 parsedServices = parsedServices.map((service, index) => {
  const relatedImage = serviceImages.find((img) =>
    img.originalname.startsWith(`image-${index}-`)
  );
   return {
    ...service,
    image: relatedImage ? fileToUrl(relatedImage) : "",
  };
});
  

const existing = await Service.findOne();
  if (existing) {
    throw new ApiError(409,"Data Already exists");
  }
  

  // add the url to database

  const data = await Service.create({
    serviceImage:serviceUrl,
    serviceHeader,
    servicesDescription,
    services:parsedServices,
    toolHeading,
    tools:parsedTools
  });
  if (!data) {
    throw new ApiError(500, "Data not saved in database");
  }
  // return the response to user if data is saved

  return res.status(201).json(new ApiResponse(200, data, "Data saved"));
});

const read = asyncHandler(async (req, res) => {
  const data = await Service.find();
  if (!data) {
    throw new ApiError(404, "Data not found in database");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Data fetched succcessfully"));
});

const update = asyncHandler(async (req, res) => {
  const existing = await Service.findOne();
    if (!existing) {
      throw new ApiError(404, "No data found to update");
    }
 const {id}=req.params;

  const updatedFields = { ...req.body };
  const files = req.files;
  const fileToUrl = (file) => "/" + file.path.replace(/\\/g, "/");

  if (files?.serviceImage?.[0]) {
    updatedFields.serviceImage = fileToUrl(files.serviceImage[0]);
  }
  
  

  if (req.body.tools) {
    const parsedTools = JSON.parse(req.body.tools);
    const toolImages = files?.toolImage || [];

    const enrichedTools = parsedTools.map((tool, index) => {
      const image = toolImages.find((img) =>
        img.originalname.startsWith(`tool-${index}-`)
      );
      return {
        ...tool,
        toolImage: image ? fileToUrl(image) : existing.tools?.[index]?.toolImage || "",
      };
    });

    updatedFields.tools = enrichedTools;
  }
  if (req.body.services) {
    const parsedServices = JSON.parse(req.body.services);
    const images = files?.image || [];

    const enrichedServices = parsedServices.map((service, index) => {
      const image = images.find((img) =>
        img.originalname.startsWith(`image-${index}-`)
      );
      return {
        ...service,
        image: image ? fileToUrl(image) : existing.services?.[index]?.image || "",
      };
    });

    updatedFields.services = enrichedServices;
  }

  await Service.findByIdAndUpdate(id, updatedFields, { new: true });

  return res.status(200).json(
    new ApiResponse(200,{},"Service updated successfully")
  )
});

const deleteOne = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    deleteServiceImage = false,
    deleteServiceHeader = false,
    deleteServicesDescription = false,
    deleteToolHeading = false,
    deleteToolsIndexes = [],
    deleteServicesIndexes = [],
  } = req.body;

  const service = await Service.findById(id);
  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  if (deleteServiceImage) service.serviceImage = "";
  if (deleteServiceHeader) service.serviceHeader = "";
  if (deleteServicesDescription) service.servicesDescription = "";
  if (deleteToolHeading) service.toolHeading = "";

  // Delete selected tool entries
  if (Array.isArray(deleteToolsIndexes) && deleteToolsIndexes.length > 0) {
    service.tools = service.tools.filter((_, index) => !deleteToolsIndexes.includes(index));
  }

  // Delete selected service entries
  if (Array.isArray(deleteServicesIndexes) && deleteServicesIndexes.length > 0) {
    service.services = service.services.filter((_, index) => !deleteServicesIndexes.includes(index));
  }

  await service.save();

  res.status(200).json(new ApiResponse(200, service, "Selected fields and entries deleted"));
});

const deleteAll = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedDoc = await Service.findByIdAndDelete(id);

  if (!deletedDoc) {
    throw new ApiError(404, "Document not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, deletedDoc, "Entire document deleted"));
});

export { create, read, update,deleteAll,deleteOne };
