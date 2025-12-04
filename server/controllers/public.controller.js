const { getConnection, sql } = require("../config/database");
const {
  attachImagesToProducts,
  attachImagesToProduct,
} = require("../services/productImageService");
const { PRODUCT, PAGINATION } = require("../config/constants");

const getPublicProducts = async (req, res) => {
  try {
    const pool = await getConnection();
    const { q } = req.query;
    const search = q ? q.trim() : "";

    const page = parseInt(req.query.page, 10) || PAGINATION.DEFAULT_PAGE;
    const pageSize =
      parseInt(req.query.pageSize, 10) || PAGINATION.DEFAULT_PAGE_SIZE;
    const offset = (page - 1) * pageSize;

    let whereClause = `WHERE Inventory > ${PRODUCT.MIN_PUBLIC_INVENTORY}`;
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
      SELECT Id, Name, Description, Price, SKU, Inventory
      FROM Products
      ${whereClause}
      ORDER BY Name ASC
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
    console.error("Get public products error:", error);
    res.status(500).json({ message: "Error al obtener productos" });
  }
};

const getPublicProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const productId = parseInt(id, 10);
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({ message: "ID de producto inválido" });
    }

    const pool = await getConnection();
    const request = pool.request();
    request.input("id", sql.Int, productId);
    request.input("minInventory", sql.Int, PRODUCT.MIN_PUBLIC_INVENTORY);

    const result = await request.query(`
      SELECT Id, Name, Description, Price, SKU, Inventory, CreatedAt, UpdatedAt
      FROM Products
      WHERE Id = @id AND Inventory > @minInventory
    `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({
          message: "Producto no encontrado o sin inventario disponible",
        });
    }

    const product = result.recordset[0];
    const productWithImages = await attachImagesToProduct(product);

    res.json(productWithImages);
  } catch (error) {
    console.error("Get public product by id error:", error);
    res.status(500).json({ message: "Error al obtener producto" });
  }
};

module.exports = {
  getPublicProducts,
  getPublicProductById,
};
