const express = require('express');
const router = express.Router();
const controller = require('../controllers/edicion_controllers');

/**
 * @swagger
 * /ediciones:
 *   post:
 *     summary: Crea una nueva edición.
 *     tags: [Ediciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Edicion'
 *     responses:
 *       201:
 *         description: Edición creada con éxito.
 *       409:
 *         description: Ya existe una edición con este título.
 *       500:
 *         description: Error interno del servidor.
 */
router.post('/', controller.crearEdicion);

/**
 * @swagger
 * /ediciones/{id}:
 *   put:
 *     summary: Actualiza una edición existente por su ID.
 *     tags: [Ediciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la edición.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Edicion'
 *     responses:
 *       200:
 *         description: Edición actualizada exitosamente.
 *       404:
 *         description: Edición no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.put('/:id', controller.actualizarEdicion);

/**
 * @swagger
 * /ediciones/{id}:
 *   delete:
 *     summary: Desactiva una edición.
 *     tags: [Ediciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la edición.
 *     responses:
 *       200:
 *         description: Edición desactivada con éxito.
 *       404:
 *         description: Edición no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete('/:id', controller.desactivarEdicion);

/**
 * @swagger
 * /ediciones:
 *   get:
 *     summary: Lista las ediciones activas.
 *     tags: [Ediciones]
 *     responses:
 *       200:
 *         description: Lista de ediciones activas.
 *       204:
 *         description: No hay ediciones activas.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/', controller.listarEdicionesActivas);

/**
 * @swagger
 * /ediciones/{id}:
 *   get:
 *     summary: Obtiene una edición por su ID.
 *     tags: [Ediciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la edición.
 *     responses:
 *       200:
 *         description: Edición encontrada.
 *       404:
 *         description: Edición no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/:id', controller.obtenerEdicionPorId);

module.exports = router;
