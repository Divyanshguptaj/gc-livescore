import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

export const uploadToCloudinary = (file, folder, height, quality) => {
  return new Promise((resolve, reject) => {
    const options = {
      folder,
      resource_type: 'auto',
    };

    if (height) options.height = height;
    if (quality) options.quality = quality;

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const generateThumbnail = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: 'video',
    format: 'jpg',
    transformation: [
      { width: 300, height: 200, crop: 'fill' },
      { quality: 'auto' }
    ]
  });
};
