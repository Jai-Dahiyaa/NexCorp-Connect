import { connectCloudinary } from '../config/cloudinary.js';

export const uploadImageFromUrl = async (imageUrl, folderName = 'uploads') => {
  try {
    const cloudinary = connectCloudinary();
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folderName,
    });
    return result.secure_url; 
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const uploadBufferImage = (fileBuffer, folderName = 'uploads') => {
  return new Promise((resolve, reject) => {
    const cloudinary = connectCloudinary();

    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url); 
        }
      }
    );

    stream.end(fileBuffer);
  });
};