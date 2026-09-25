import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errorHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "Each attachment must be 10 MB or smaller.",
      });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(413).json({
        success: false,
        message: "You can upload a maximum of 5 attachments.",
      });
    }
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
