import { API_BASE_URL } from "../constants/config";

export const getProductImages = (product) => {
  if (!product) return [];
  return product.Images || (product.Image ? [product.Image] : []);
};

export const getProductPrimaryImage = (product) => {
  if (!product) return null;
  const images = getProductImages(product);
  return product.PrimaryImage || images[0] || product.Image || null;
};

export const buildImageUrl = (imagePath, baseUrl = API_BASE_URL) => {
  if (!imagePath) return null;
  return imagePath.startsWith("http") ? imagePath : `${baseUrl}${imagePath}`;
};

export const getProductImageUrls = (product) => {
  const images = getProductImages(product);
  return images.map((img) => buildImageUrl(img)).filter(Boolean);
};

export const getProductPrimaryImageUrl = (product) => {
  const primaryImage = getProductPrimaryImage(product);
  return buildImageUrl(primaryImage);
};
