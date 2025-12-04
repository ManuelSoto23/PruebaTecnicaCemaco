const { getConnection, sql } = require("../config/database");
const {
  attachImagesToProducts,
  attachImagesToProduct,
  insertProductImages,
  deleteProductImages,
  updateImageOrder,
  getProductImages,
} = require("../services/productImageService");
const { deleteImageFiles } = require("../services/fileService");
const { PRODUCT, PAGINATION } = require("../config/constants");

const getAllProducts = async (req, res) => {
  try {
    const pool = await getConnection();
    const { q } = req.query;
    const search = q ? q.trim() : "";

    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const pageSize =
      parseInt(req.query.pageSize, 10) || PAGINATION.DEFAULT_PAGE_SIZE;
    const offset = (page - 1) * pageSize;

    let whereClause = "WHERE 1 = 1";
    if (search) {
      whereClause += " AND (Name LIKE @search OR SKU LIKE @search)";
    }

    const countRequest = pool.request();
    if (search) {
      countRequest.input("search", sql.NVarChar, `%${search}%`);
    }
    const countResult = await countRequest.query(`
      SELECT COUNT(*) AS total
      FROM Products
      ${whereClause}
    `);
    const total = countResult.recordset[0].total;

    const listRequest = pool.request();
    if (search) {
      listRequest.input("search", sql.NVarChar, `%${search}%`);
    }
    listRequest.input("offset", sql.Int, offset);
    listRequest.input("pageSize", sql.Int, pageSize);
    const result = await listRequest.query(`
      SELECT Id, Name, Description, Price, SKU, Inventory, CreatedAt, UpdatedAt
      FROM Products
      ${whereClause}
      ORDER BY CreatedAt DESC
      OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
    `);

    const productsWithImages = await attachImagesToProducts(result.recordset);

    res.json({
      items: productsWithImages,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    });
  } catch (error) {
    console.error("Get all products error:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const productId = parseInt(id, 10);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const pool = await getConnection();
    const request = pool.request();
    request.input("id", sql.Int, productId);

    const result = await request.query(`
      SELECT Id, Name, Description, Price, SKU, Inventory, CreatedAt, UpdatedAt
      FROM Products
      WHERE Id = @id
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const product = result.recordset[0];
    const productWithImages = await attachImagesToProduct(product);

    res.json(productWithImages);
  } catch (error) {
    console.error("Get product by id error:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, sku, inventory } = req.body;
    const files = req.files || [];
    const images = files.map((file) => `/uploads/${file.filename}`);

    if (!name || !price || !sku || inventory === undefined) {
      return res
        .status(400)
        .json({ message: "Nombre, precio, SKU e inventario son requeridos" });
    }

    const pool = await getConnection();

    const checkSkuRequest = pool.request();
    checkSkuRequest.input("sku", sql.NVarChar, sku);
    const skuCheck = await checkSkuRequest.query(`
      SELECT Id FROM Products WHERE SKU = @sku
    `);

    if (skuCheck.recordset.length > 0) {
      return res.status(400).json({ message: "El SKU ya existe" });
    }

    const request = pool.request();
    request.input("name", sql.NVarChar, name);
    request.input("description", sql.NVarChar(sql.MAX), description || "");
    request.input("price", sql.Decimal(18, 2), parseFloat(price));
    request.input("sku", sql.NVarChar, sku);
    request.input("inventory", sql.Int, parseInt(inventory));

    const result = await request.query(`
      INSERT INTO Products (Name, Description, Price, SKU, Inventory)
      OUTPUT INSERTED.*
      VALUES (@name, @description, @price, @sku, @inventory)
    `);

    const productId = result.recordset[0].Id;

    if (images.length > 0) {
      await insertProductImages(pool, productId, images, 0);
    }

    const productRequest = pool.request();
    productRequest.input("productId", sql.Int, productId);
    const productResult = await productRequest.query(`
      SELECT Id, Name, Description, Price, SKU, Inventory, CreatedAt, UpdatedAt
      FROM Products
      WHERE Id = @productId
    `);

    const productWithImages = await attachImagesToProduct(
      productResult.recordset[0]
    );

    res.status(201).json(productWithImages);
  } catch (error) {
    console.error("Create product error:", error);
    if (error.number === 2627) {
      return res.status(400).json({ message: "El SKU ya existe" });
    }
    res.status(500).json({ message: "Error al crear producto" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productId = parseInt(id, 10);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const { name, description, price, sku, inventory, deleteImages } = req.body;
    const files = req.files || [];
    const newImages = files.map((file) => `/uploads/${file.filename}`);

    const pool = await getConnection();
    const request = pool.request();
    request.input("id", sql.Int, productId);

    const currentProduct = await request.query(`
      SELECT Id FROM Products WHERE Id = @id
    `);

    if (currentProduct.recordset.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const updateFields = [];
    if (name) {
      request.input("name", sql.NVarChar, name);
      updateFields.push("Name = @name");
    }
    if (description !== undefined) {
      request.input("description", sql.NVarChar(sql.MAX), description);
      updateFields.push("Description = @description");
    }
    if (price) {
      request.input("price", sql.Decimal(18, 2), parseFloat(price));
      updateFields.push("Price = @price");
    }
    if (sku) {
      const checkSkuRequest = pool.request();
      checkSkuRequest.input("sku", sql.NVarChar, sku);
      checkSkuRequest.input("id", sql.Int, productId);
      const skuCheck = await checkSkuRequest.query(`
        SELECT Id FROM Products WHERE SKU = @sku AND Id != @id
      `);

      if (skuCheck.recordset.length > 0) {
        return res
          .status(400)
          .json({ message: "El SKU ya existe en otro producto" });
      }

      request.input("sku", sql.NVarChar, sku);
      updateFields.push("SKU = @sku");
    }
    if (inventory !== undefined) {
      request.input("inventory", sql.Int, parseInt(inventory));
      updateFields.push("Inventory = @inventory");
    }

    if (deleteImages) {
      const imagesToDelete = Array.isArray(deleteImages)
        ? deleteImages
        : [deleteImages];

      const { images: currentImages } = await getProductImages(productId);
      const imagesToDeleteFromDB = imagesToDelete.filter((img) => {
        return currentImages.some(
          (current) => current.includes(img) || img.includes(current)
        );
      });

      if (imagesToDeleteFromDB.length > 0) {
        await deleteProductImages(pool, productId, imagesToDeleteFromDB);
        deleteImageFiles(imagesToDeleteFromDB);
      }
    }

    let imageOrder = null;
    if (req.body.imageOrder) {
      try {
        imageOrder = JSON.parse(req.body.imageOrder);
      } catch (e) {
        console.error("Error parsing imageOrder:", e);
      }
    }

    if (newImages.length > 0) {
      await insertProductImages(
        pool,
        productId,
        newImages,
        PRODUCT.TEMP_IMAGE_ORDER_BASE
      );
    }

    if (imageOrder && imageOrder.length > 0) {
      await updateImageOrder(pool, productId, imageOrder, newImages);
    } else if (newImages.length > 0) {
      const currentImagesRequest = pool.request();
      currentImagesRequest.input("productId", sql.Int, productId);
      const currentImagesResult = await currentImagesRequest.query(`
        SELECT MAX(DisplayOrder) as maxOrder FROM ProductImages WHERE ProductId = @productId
      `);
      const startOrder =
        currentImagesResult.recordset[0].maxOrder !== null
          ? currentImagesResult.recordset[0].maxOrder + 1
          : 0;

      for (let i = 0; i < newImages.length; i++) {
        const updateOrderRequest = pool.request();
        updateOrderRequest.input("productId", sql.Int, productId);
        updateOrderRequest.input("imagePath", sql.NVarChar, newImages[i]);
        updateOrderRequest.input("displayOrder", sql.Int, startOrder + i);
        await updateOrderRequest.query(`
          UPDATE ProductImages 
          SET DisplayOrder = @displayOrder 
          WHERE ProductId = @productId AND ImagePath = @imagePath
        `);
      }
    }

    if (updateFields.length === 0 && newImages.length === 0 && !deleteImages) {
      return res.status(400).json({ message: "No hay campos para actualizar" });
    }

    if (updateFields.length > 0) {
      updateFields.push("UpdatedAt = GETDATE()");
      await request.query(`
        UPDATE Products
        SET ${updateFields.join(", ")}
        WHERE Id = @id
      `);
    }

    const productRequest = pool.request();
    productRequest.input("productId", sql.Int, productId);
    const productResult = await productRequest.query(`
      SELECT Id, Name, Description, Price, SKU, Inventory, CreatedAt, UpdatedAt
      FROM Products
      WHERE Id = @productId
    `);

    const productWithImages = await attachImagesToProduct(
      productResult.recordset[0]
    );

    res.json(productWithImages);
  } catch (error) {
    console.error("Update product error:", error);
    if (error.number === 2627) {
      return res.status(400).json({ message: "El SKU ya existe" });
    }
    res.status(500).json({ message: "Error al actualizar producto" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const productId = parseInt(id, 10);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const pool = await getConnection();
    const request = pool.request();
    request.input("id", sql.Int, productId);

    const { images } = await getProductImages(productId);

    const product = await request.query(`
      SELECT Id FROM Products WHERE Id = @id
    `);

    if (product.recordset.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await request.query(`
      DELETE FROM Products WHERE Id = @id
    `);

    deleteImageFiles(images);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Error al eliminar producto" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
