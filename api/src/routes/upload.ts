import { Router } from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary";
import { requireAdmin } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/image",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      console.log("Uploading file:", req.file.originalname, req.file.mimetype);

      const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64",
      )}`;

      const result = await cloudinary.uploader.upload(base64, {
        folder: "quotepilot/products",
      });

      console.log("Cloudinary upload success:", result.secure_url);
      res.json({ url: result.secure_url });
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      res.status(500).json({
        message: "Failed to upload image",
        error: error.message,
      });
    }
  },
);

export default router;
