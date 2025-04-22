const express = require('express');
const unidadControllers = require('../controllers/unidad_controllers');
const router = express.Router();
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Unidad:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado de la unidad
 *         nombreUnidad:
 *           type: string
 *           description: Nombre de la unidad
 *         estadoUnidad:
 *           type: boolean
 *           description: Estado de la unidad (activa/inactiva)
 *           default: true
 *         brigadaId:
 *           type: string
 *           description: ID de la brigada asociada
 *         usuarioId:
 *           type: string
 *           description: ID del usuario responsable

 *     UnidadCreate:
 *       type: object
 *       required:
 *         - nombreUnidad
 *         - brigadaId
 *         - usuarioId
 *       properties:
 *         nombreUnidad:
 *           type: string
 *           description: Nombre de la unidad
 *         estadoUnidad:
 *           type: boolean
 *           description: Estado de la unidad (activa/inactiva)
 *           default: true
 *         brigadaId:
 *           type: string
 *           description: ID de la brigada asociada
 *         usuarioId:
 *           type: string
 *           description: ID del usuario responsable

 *     UnidadUpdate:
 *       type: object
 *       properties:
 *         nombreUnidad:
 *           type: string
 *           description: Nombre de la unidad
 *         estadoUnidad:
 *           type: boolean
 *           description: Estado de la unidad (activa/inactiva)
 *         brigadaId:
 *           type: string
 *           description: ID de la brigada asociada
 *         usuarioId:
 *           type: string
 *           description: ID del usuario responsable
 */

/**
 * @swagger
 * tags:
 *   - name: Unidad
 *     description: API para gestionar unidades
 */

/**
 * @swagger
 * /api/unidades:
 *   get:
 *     tags:
 *       - Unidad
 *     summary: Obtener todas las unidades activas
 *     responses:
 *       200:
 *         description: Lista de unidades activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Unidad'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', verifyJWT, verifyRole(['Instructor','Administrativo', 'Root']), unidadControllers.listarUnidades);

/**
 * @swagger
 * /api/unidades:
 *   post:
 *     tags: 
 *       - Unidad
 *     summary: Crear una nueva unidad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnidadCreate'
 *     responses:
 *       201:
 *         description: Unidad creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unidad'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verifyJWT, verifyRole(['Administrativo', 'Root']), unidadControllers.crearUnidad);

/**
 * @swagger
 * /api/unidades/{id}:
 *   put:
 *     tags: 
 *       - Unidad
 *     summary: Actualizar unidad por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la unidad
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnidadUpdate'
 *     responses:
 *       200:
 *         description: Unidad actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unidad'
 *       404:
 *         description: Unidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), unidadControllers.actualizarUnidad);

/**
 * @swagger
 * /api/unidades/{id}:
 *   get:
 *     tags:
 *       - Unidad
 *     summary: Obtener unidad por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la unidad a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unidad obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Unidad'
 *       404:
 *         description: Unidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), unidadControllers.obtenerUnidadPorId);

/**
 * @swagger
 * /api/unidades/{id}:
 *   delete:
 *     tags: 
 *       - Unidad
 *     summary: Desactivar unidad por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la unidad
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unidad desactivada correctamente
 *       404:
 *         description: Unidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), unidadControllers.desactivarUnidad);

module.exports = router;
