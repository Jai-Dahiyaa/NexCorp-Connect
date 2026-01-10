import { v2 as cloudinary } from 'cloudinary';
import logger from './logger.js';

export const connectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    if (
      process.env.CLOUDINARY_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      logger.info('Cloudinary connected successfully');
    } else {
      logger.error('Cloudinary config missing keys');
    }
    return cloudinary;
  } catch (error) {
    console.error('Cloudinary connection failed:', error.message);
    throw error;
  }
};
