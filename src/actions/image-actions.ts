'use server'

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary (ensure these are set in your .env.local file)
cloudinary.config({
  cloud_name: "ducftax3j",
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export type UploadResult = {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
};


export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "lms_default";

    /* ----------------------------
       Validation
    ----------------------------- */
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files are allowed" };
    }

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      return { success: false, error: "Image must be less than 2MB" };
    }

    /* ----------------------------
       Convert to Buffer
    ----------------------------- */
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    /* ----------------------------
       Upload to Cloudinary
    ----------------------------- */
    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            overwrite: true,
            transformation: [
              { width: 1600, height: 900, crop: "limit" },
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (error || !result) {
              reject(error);
            } else {
              resolve(result as any);
            }
          }
        )
        .end(buffer);
    });

    return {
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    console.error("[UPLOAD_IMAGE_ERROR]", error);
    return {
      success: false,
      error: "Failed to upload image",
    };
  }
}
