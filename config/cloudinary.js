import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUD_API_KEY, CLOUD_API_SECRET, CLOUD_NAME } from './env.js';

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

// Multer Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes",
    resource_type: "auto",
    allowed_formats: ["pdf"],
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  }
});

// Extract public ID from Cloudinary URL
function extractPublicIdFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    const uploadIndex = pathParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) throw new Error("Invalid Cloudinary URL");

    const publicIdParts = pathParts.slice(uploadIndex + 2);
    const filename = publicIdParts.pop();
    const nameWithoutExt = filename.split('.')[0];
    publicIdParts.push(nameWithoutExt);

    return publicIdParts.join('/');
  } catch (err) {
    throw new Error('Failed to extract public_id from URL');
  }
}

// Delete from Cloudinary
export async function deleteFromCloudinary(fileUrl) {
  try {
    const publicId = extractPublicIdFromUrl(fileUrl);
    console.log("Attempting to delete:", publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: 'image', // for PDFs
    });

    console.log("Cloudinary result:", result);
    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error.message);
    throw error;
  }
}
