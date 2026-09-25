import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

const allowedExtensions = /\.(jpeg|jpg|png|gif|webp|avif)$/i;

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  const extValid = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (!extValid) {
    return cb(new Error("Only valid image files are allowed"));
  }

  cb(null, true);
};

const localFileUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 5,
  },
});

export default localFileUpload;
