import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');
    return {
      folder: isVideo ? 'cricket-videos' : 'cricket-profiles',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo
        ? ['mp4', 'mov', 'avi', 'webm']
        : ['jpg', 'jpeg', 'png', 'webp'],
      transformation: !isVideo
        ? [{ width: 500, height: 500, crop: 'limit' }]
        : undefined,
    };
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/', 'video/'];
  if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max for videos
  },
});

// Middleware examples:
export const uploadProfileImage = upload.single('profileImage'); // For profile uploads
export const uploadMedia = upload.single('media'); // For video/image form fields
