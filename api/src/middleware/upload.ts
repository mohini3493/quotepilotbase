import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../lib/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "quotepilot",
    allowed_formats: ["jpg", "png", "webp"],
    transformation: [{ width: 1200, crop: "limit" }],
  } as any,
});

export const upload = multer({ storage });
