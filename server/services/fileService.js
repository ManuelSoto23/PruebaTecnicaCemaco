const fs = require("fs");
const path = require("path");

const deleteImageFile = (imagePath) => {
  try {
    const filePath = path.join(__dirname, "..", imagePath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file ${imagePath}:`, error);
    return false;
  }
};

const deleteImageFiles = (imagePaths) => {
  return imagePaths.map((imagePath) => deleteImageFile(imagePath));
};

const imageFileExists = (imagePath) => {
  try {
    const filePath = path.join(__dirname, "..", imagePath);
    return fs.existsSync(filePath);
  } catch (error) {
    console.error(`Error checking file ${imagePath}:`, error);
    return false;
  }
};

module.exports = {
  deleteImageFile,
  deleteImageFiles,
  imageFileExists,
};
