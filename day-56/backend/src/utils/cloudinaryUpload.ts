import { Readable } from "stream";
import cloudinary from "../config/cloud.config";

export function uploadToCloudinary(buffer: Buffer, originalName: string) {
  return new Promise<{
    url: string;
    publicId: string;
    resourceType: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "support-tickets",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Cloudinary upload failed."));
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
        });
      },
    );

    Readable.from(buffer).pipe(uploadStream);
  });
}
