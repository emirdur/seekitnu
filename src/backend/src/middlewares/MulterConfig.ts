// src/backend/src/multerconfig.ts
import multer from "multer";
import path from "path";

// Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../uploads")); // Point to /app/src/backend/uploads
  },
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a timestamp for file name
  },
});

const upload = multer({ storage });

export default upload;
