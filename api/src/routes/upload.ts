import { Router } from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinary";
import { requireAdmin } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/image", requireAdmin, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const base64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
    "base64"
  )}`;

  const result = await cloudinary.uploader.upload(base64, {
    folder: "quotepilot/products",
  });

  res.json({ url: result.secure_url });
});

export default router;
