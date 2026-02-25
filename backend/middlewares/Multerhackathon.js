// middleware/multerHackathon.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads/temp directory exists
const tempDir = path.join(__dirname, "../uploads/temp");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, GIF, WEBP allowed.`), false);
  }
};

const hackathonUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 11, // 1 banner + max 10 gallery
  },
});

// Use this on the createHackathon route:
// handles field "image" (single banner) + field "gallery" (up to 10)
export const uploadHackathonImages = hackathonUpload.fields([
  { name: "image", maxCount: 1 },
  { name: "gallery", maxCount: 10 },
]);

// Use this on the addGalleryImages route:
// handles multiple files under field "image"
export const uploadGalleryImages = hackathonUpload.array("image", 10);

export default hackathonUpload;