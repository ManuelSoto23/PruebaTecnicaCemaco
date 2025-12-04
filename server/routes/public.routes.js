const express = require('express');
const router = express.Router();
const { getPublicProducts, getPublicProductById } = require('../controllers/public.controller');

/**
 * @swagger
 * /api/public/products:
 *   get:
 *     summary: Obtener lista de productos públicos
 *     tags:
 *       - Productos públicos
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
 *         description: Lista paginada de productos públicos
 *       500:
 *         description: Error al obtener productos
 */
router.get('/products', getPublicProducts);

/**
 * @swagger
 * /api/public/products/{id}:
 *   get:
 *     summary: Obtener detalle de un producto público
 *     tags:
 *       - Productos públicos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Detalle del producto
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error al obtener el producto
 */
router.get('/products/:id', getPublicProductById);

module.exports = router;
