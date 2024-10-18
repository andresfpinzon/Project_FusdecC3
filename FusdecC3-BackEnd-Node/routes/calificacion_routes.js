const express = require('express');
const calificacionController = require('../controllers/calificacion_controllers');
const router = express.Router(); // Define el enrutador

/**
 * @swagger
 * components:
 *   schemas:
 *     Calificacion:
 *       type: object
 *       required:
 *         - tituloCalificacion
 *         - aprobado
 *         - usuarioId
 *         - estadoCalificacion
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado de la calificación.
 *         tituloCalificacion:
 *           type: string
 *           description: Título de la calificación.
 *         aprobado:
 *           type: boolean
 *           description: Estado de aprobación de la calificación.
 *         usuarioId:
 *           type: string
 *           description: ID del usuario asociado a la calificación.
 *         estadoCalificacion:
 *           type: boolean
 *           description: Estado de la calificación (activo/inactivo).
 *           default: true
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *             description: ID de los estudiantes asociados a la calificación.
 */

/**
 * @swagger
 * tags:
 *   - name: Calificaciones
 *     description: API para gestionar calificaciones
 */

/**
 * @swagger
 * /api/calificaciones:
 *   get:
 *     tags: 
 *       - Calificaciones
 *     summary: Obtener una lista de calificaciones activas
 *     responses:
 *       200:
 *         description: Una colección de calificaciones activas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Calificacion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                     tituloCalificacion: "Calificación Matemáticas"
 *                     aprobado: true
 *                     usuarioId: "61f7d2bbf1a2b4b5c3cdb71c"
 *                     estadoCalificacion: true
 */
router.get('/', calificacionController.listarCalificacionesActivas);

/**
 * @swagger
 * /api/calificaciones:
 *   post:
 *     tags: 
 *       - Calificaciones
 *     summary: Crear una calificación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calificacion'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 tituloCalificacion: "Calificación Historia"
 *                 aprobado: true
 *                 usuarioId: "61f7d2bbf1a2b4b5c3cdb71c"
 *                 estadoCalificacion: true
 *                 estudiantes: ["61f7d2bbf1a2b4b5c3cdb71e"]
 *     responses:
 *       201:
 *         description: Calificación creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calificacion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   tituloCalificacion: "Calificación Historia"
 *                   aprobado: true
 *                   usuarioId: "61f7d2bbf1a2b4b5c3cdb71c"
 *                   estadoCalificacion: true
 *                   estudiantes: ["61f7d2bbf1a2b4b5c3cdb71e"]
 */
router.post('/', calificacionController.crearCalificacion);

/**
 * @swagger
 * /api/calificaciones/{id}:
 *   put:
 *     tags: 
 *       - Calificaciones
 *     summary: Actualizar una calificación mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la calificación a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Calificacion'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 tituloCalificacion: "Calificación Historia Actualizada"
 *                 aprobado: false
 *                 usuarioId: "61f7d2bbf1a2b4b5c3cdb71c"
 *                 estadoCalificacion: true
 *                 estudiantes: ["61f7d2bbf1a2b4b5c3cdb71e"]
 *     responses:
 *       200:
 *         description: Calificación actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calificacion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   tituloCalificacion: "Calificación Historia Actualizada"
 *                   aprobado: false
 *                   usuarioId: "61f7d2bbf1a2b4b5c3cdb71c"
 *                   estadoCalificacion: true
 *                   estudiantes: ["61f7d2bbf1a2b4b5c3cdb71e"]
 *       404:
 *         description: Calificación no encontrada.
 */
router.put('/:id', calificacionController.actualizarCalificacion);

/**
 * @swagger
 * /api/calificaciones/{id}:
 *   delete:
 *     tags: 
 *       - Calificaciones
 *     summary: Desactivar una calificación mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la calificación a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calificación desactivada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calificacion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   tituloCalificacion: "Calificación Historia"
 *                   aprobado: true
 *                   usuarioId: "61f7d2bbf1a2b4b5c3cdb71c"
 *                   estadoCalificacion: false
 *       404:
 *         description: Calificación no encontrada.
 */
router.delete('/:id', calificacionController.desactivarCalificacion);

/**
 * @swagger
 * /api/calificaciones/{id}:
 *   get:
 *     tags: 
 *       - Calificaciones
 *     summary: Obtener una calificación mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la calificación
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Calificación obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Calificacion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   tituloCalificacion: "Calificación Matemáticas"
 *                   aprobado: true
 *                   usuarioId: "61f7d2bbf1a2b4b5c3cdb71c"
 *                   estadoCalificacion: true
 *       404:
 *         description: Calificación no encontrada.
 */
router.get('/:id', calificacionController.obtenerCalificacionPorId);

module.exports = router;

