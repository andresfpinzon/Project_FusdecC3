const express = require('express');
const calificacionesController = require('../controllers/calificacion_controllers');
const router = express.Router(); // Define el enrutador

// Listar todas las calificaciones activas
/**
 * @swagger
 * /api/calificaciones:
 *   get:
 *     summary: Listar todas las calificaciones activas
 *     tags: [Calificaciones]
 *     responses:
 *       200:
 *         description: Lista de calificaciones activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Calificacion'
 *       204:
 *         description: No hay calificaciones activas
 */
router.get('/', calificacionesController.listarCalificacionesActivas);

// Obtener calificación por ID
/**
 * @swagger
 * /api/calificaciones/{id}:
 *   get:
 *     summary: Obtener una calificación por ID
 *     tags: [Calificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la calificación
 *     responses:
 *       200:
 *         description: Calificación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calificacion'
 *       404:
 *         description: Calificación no encontrada
 */
router.get('/:id', calificacionesController.obtenerCalificacionPorId);

// Crear una nueva calificación
/**
 * @swagger
 * /api/calificaciones:
 *   post:
 *     summary: Crear una nueva calificación
 *     tags: [Calificaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calificacion'
 *     responses:
 *       201:
 *         description: Calificación creada exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 *       409:
 *         description: Calificación con el mismo título ya existe
 */
router.post('/', calificacionesController.crearCalificacion);

// Actualizar calificación por ID
/**
 * @swagger
 * /api/calificaciones/{id}:
 *   put:
 *     summary: Actualizar una calificación
 *     tags: [Calificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la calificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calificacion'
 *     responses:
 *       200:
 *         description: Calificación actualizada con éxito
 *       404:
 *         description: Calificación no encontrada
 */
router.put('/:id', calificacionesController.actualizarCalificacion);

// Desactivar calificación por ID
/**
 * @swagger
 * /api/calificaciones/{id}:
 *   patch:
 *     summary: Desactivar una calificación existente
 *     tags: [Calificaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la calificación a desactivar
 *     responses:
 *       200:
 *         description: Calificación desactivada exitosamente
 *       404:
 *         description: Calificación no encontrada
 */
router.patch('/:id', calificacionesController.desactivarCalificacion);

module.exports = router;
