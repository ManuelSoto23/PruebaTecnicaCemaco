const { getConnection, sql } = require("../config/database");

const getProductImages = async (productId) => {
  const pool = await getConnection();
  const request = pool.request();
  request.input("productId", sql.Int, productId);

  const result = await request.query(`
    SELECT Id, ImagePath, DisplayOrder
    FROM ProductImages
    WHERE ProductId = @productId
    ORDER BY DisplayOrder, Id
  `);

  return {
    images: result.recordset.map((img) => img.ImagePath),
    primaryImage:
      result.recordset.length > 0 ? result.recordset[0].ImagePath : null,
  };
};

const attachImagesToProduct = async (product) => {
  const { images, primaryImage } = await getProductImages(product.Id);
  return {
    ...product,
    Images: images,
    PrimaryImage: primaryImage,
  };
};

const attachImagesToProducts = async (products) => {
  return Promise.all(products.map((product) => attachImagesToProduct(product)));
};

const insertProductImages = async (
  pool,
  productId,
  imagePaths,
  startOrder = 0
) => {
  for (let i = 0; i < imagePaths.length; i++) {
    const imageRequest = pool.request();
    imageRequest.input("productId", sql.Int, productId);
    imageRequest.input("imagePath", sql.NVarChar, imagePaths[i]);
    imageRequest.input("displayOrder", sql.Int, startOrder + i);
    await imageRequest.query(`
      INSERT INTO ProductImages (ProductId, ImagePath, DisplayOrder)
      VALUES (@productId, @imagePath, @displayOrder)
    `);
  }
};

const deleteProductImages = async (pool, productId, imagePaths) => {
  for (const imagePath of imagePaths) {
    const deleteRequest = pool.request();
    deleteRequest.input("productId", sql.Int, productId);
    deleteRequest.input("imagePath", sql.NVarChar, imagePath);
    await deleteRequest.query(`
      DELETE FROM ProductImages 
      WHERE ProductId = @productId AND ImagePath = @imagePath
    `);
  }
};

const updateImageOrder = async (
  pool,
  productId,
  imageOrder,
  newImages = []
) => {
  const allImagesRequest = pool.request();
  allImagesRequest.input("productId", sql.Int, productId);
  const allImagesResult = await allImagesRequest.query(`
    SELECT Id, ImagePath FROM ProductImages WHERE ProductId = @productId
  `);

  const imageMap = {};
  allImagesResult.recordset.forEach((img) => {
    imageMap[img.ImagePath] = img.Id;
  });

  let newImageIndex = 0;
  for (let orderIndex = 0; orderIndex < imageOrder.length; orderIndex++) {
    const imagePath = imageOrder[orderIndex];

    if (imagePath === "NEW") {
      if (newImageIndex < newImages.length) {
        const newImagePath = newImages[newImageIndex];
        const imageId = imageMap[newImagePath];
        if (imageId) {
          const updateOrderRequest = pool.request();
          updateOrderRequest.input("imageId", sql.Int, imageId);
          updateOrderRequest.input("displayOrder", sql.Int, orderIndex);
          await updateOrderRequest.query(`
            UPDATE ProductImages SET DisplayOrder = @displayOrder WHERE Id = @imageId
          `);
        }
        newImageIndex++;
      }
    } else {
      const imageId = imageMap[imagePath];
      if (imageId) {
        const updateOrderRequest = pool.request();
        updateOrderRequest.input("imageId", sql.Int, imageId);
        updateOrderRequest.input("displayOrder", sql.Int, orderIndex);
        await updateOrderRequest.query(`
          UPDATE ProductImages SET DisplayOrder = @displayOrder WHERE Id = @imageId
        `);
      }
    }
  }
};

module.exports = {
  getProductImages,
  attachImagesToProduct,
  attachImagesToProducts,
  insertProductImages,
  deleteProductImages,
  updateImageOrder,
};
