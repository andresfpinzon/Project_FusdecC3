const express = require('express');
const router = express.Router();
const brigadaController = require('../controllers/brigada_controllers');
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Brigada:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado de la brigada
 *         nombreBrigada:
 *           type: string
 *           description: Nombre de la brigada
 *         ubicacionBrigada:
 *           type: string
 *           description: Ubicación de la brigada
 *         estadoBrigada:
 *           type: boolean
 *           description: Estado de la brigada (activo/inactivo)
 *         comandoId:
 *           type: string
 *           description: ID del comando asociado
 *         unidades:
 *           type: array
 *           items:
 *             type: string
 *             description: ID de unidad asociada

 *     BrigadaCreate:
 *       type: object
 *       required:
 *         - nombreBrigada
 *         - ubicacionBrigada
 *         - estadoBrigada
 *         - comandoId
 *       properties:
 *         nombreBrigada:
 *           type: string
 *           description: Nombre de la brigada
 *         ubicacionBrigada:
 *           type: string
 *           description: Ubicación de la brigada
 *         estadoBrigada:
 *           type: boolean
 *           description: Estado de la brigada (activo/inactivo)
 *         comandoId:
 *           type: string
 *           description: ID del comando asociado

 *     BrigadaUpdate:
 *       type: object
 *       properties:
 *         nombreBrigada:
 *           type: string
 *           description: Nombre de la brigada
 *         ubicacionBrigada:
 *           type: string
 *           description: Ubicación de la brigada
 *         estadoBrigada:
 *           type: boolean
 *           description: Estado de la brigada (activo/inactivo)
 *         comandoId:
 *           type: string
 *           description: ID del comando asociado
 */


/**
 * @swagger
 * tags:
 *   - name: Brigada
 *     description: API para gestionar brigadas
 */

/**
 * @swagger
 * /api/brigadas:
 *   get:
 *     tags:
 *       - Brigada
 *     summary: Obtener todas las brigadas
 *     responses:
 *       200:
 *         description: Lista de brigadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brigada'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', verifyJWT, verifyRole(['Secretario', 'Instructor', 'Administrativo', 'Root']), brigadaController.listarBrigadas);

/**
 * @swagger
 * /api/brigadas:
 *   post:
 *     tags: 
 *       - Brigada
 *     summary: Crear una nueva brigada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrigadaCreate'
 *     responses:
 *       201:
 *         description: Brigada creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brigada'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verifyJWT, verifyRole(['Administrativo', 'Root']), brigadaController.crearBrigada);

/**
 * @swagger
 * /api/brigadas/{id}:
 *   put:
 *     tags: 
 *       - Brigada
 *     summary: Actualizar brigada por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la brigada
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BrigadaUpdate'
 *     responses:
 *       200:
 *         description: Brigada actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brigada'
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), brigadaController.actualizarBrigada);

/**
 * @swagger
 * /api/brigadas/{id}:
 *   get:
 *     tags:
 *       - Brigada
 *     summary: Obtener brigada por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la brigada a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brigada obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brigada'
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), brigadaController.obtenerBrigadaPorId);


/**
 * @swagger
 * /api/brigadas/{id}:
 *   delete:
 *     tags: 
 *       - Brigada
 *     summary: Desactivar brigada por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la brigada
 *         schema:
 *           type: string
 *           example: string
 *     responses:
 *       200:
 *         description: Brigada desactivada correctamente
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), brigadaController.desactivarBrigada);

/**
 * @swagger
 * /api/brigadas/{id}/unidades:
 *   post:
 *     tags:
 *       - Brigada
 *     summary: Agregar unidades a una brigada
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la brigada
 *         schema:
 *           type: string
 *           example: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unidadIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: string
 *     responses:
 *       200:
 *         description: Unidades agregadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brigada'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:id/unidades', verifyJWT, verifyRole(['Administrativo', 'Root']), brigadaController.agregarUnidades);

module.exports = router;
