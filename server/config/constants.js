module.exports = {
  PRODUCT: {
    MIN_PUBLIC_INVENTORY: 5,
    MAX_IMAGES_PER_PRODUCT: 10,
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    TEMP_IMAGE_ORDER_BASE: 9999,
  },
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_PAGE_SIZE: 8,
  },
  FILE_UPLOAD: {
    ALLOWED_IMAGE_TYPES: ["jpeg", "jpg", "png", "gif", "webp"],
    UPLOAD_DIR: "uploads",
  },
};
