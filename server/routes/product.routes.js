const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");
const {
  authenticateToken,
  authorizeRole,
} = require("../middleware/auth.middleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "product-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const { PRODUCT, FILE_UPLOAD } = require("../config/constants");

const upload = multer({
  storage: storage,
  limits: { fileSize: PRODUCT.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = new RegExp(FILE_UPLOAD.ALLOWED_IMAGE_TYPES.join("|"));
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          `Solo se permiten imágenes (${FILE_UPLOAD.ALLOWED_IMAGE_TYPES.join(
            ", "
          )})`
        )
      );
    }
  },
});

/**
 * @swagger
 * tags:
 *   name: Productos (admin)
 *   description: Gestión de productos privados (requiere autenticación)
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtener todos los productos (admin)
 *     tags:
 *       - Productos (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página (por defecto 1)
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Cantidad de productos por página (por defecto 8)
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Texto de búsqueda por nombre o SKU
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error al obtener productos
 */
router.get("/", authenticateToken, getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener detalle de un producto (admin)
 *     tags:
 *       - Productos (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del producto
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.get("/:id", authenticateToken, getProductById);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags:
 *       - Productos (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               sku:
 *                 type: string
 *               inventory:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Producto creado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 */

router.post(
  "/",
  authenticateToken,
  authorizeRole("Administrador", "Colaborador"),
  upload.array("images", PRODUCT.MAX_IMAGES_PER_PRODUCT),
  createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags:
 *       - Productos (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               sku:
 *                 type: string
 *               inventory:
 *                 type: integer
 *               imageOrder:
 *                 type: array
 *                 items:
 *                   type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRole("Administrador", "Colaborador"),
  upload.array("images", PRODUCT.MAX_IMAGES_PER_PRODUCT),
  updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags:
 *       - Productos (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Producto eliminado
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Producto no encontrado
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRole("Administrador"),
  deleteProduct
);

module.exports = router;
