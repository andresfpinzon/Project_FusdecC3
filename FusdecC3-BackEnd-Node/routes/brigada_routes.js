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
 *       required:
 *         - nombreBrigada
 *         - ubicacionBrigada
 *         - estadoBrigada
 *         - comandoId
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado de la brigada.
 *         nombreBrigada:
 *           type: string
 *           description: Nombre de la brigada.
 *           minLength: 3
 *           maxLength: 100
 *         ubicacionBrigada:
 *           type: string
 *           description: Ubicación de la brigada.
 *           minLength: 3
 *           maxLength: 200
 *         estadoBrigada:
 *           type: boolean
 *           description: Estado de la brigada (activo/inactivo).
 *         comandoId:
 *           type: string
 *           description: ID del comando asociado (ObjectId).
 *           pattern: '^[0-9a-fA-F]{24}$'
 *         unidades:
 *           type: array
 *           items:
 *             type: string
 *             pattern: '^[0-9a-fA-F]{24}$'
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
 *     summary: Listar todas las brigadas
 *     responses:
 *       200:
 *         description: Lista de brigadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Brigada'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - _id: "60d5ec49f1a2c8b1f8e4e1a3"
 *                     nombreBrigada: "Brigada Alpha"
 *                     ubicacionBrigada: "Ciudad A"
 *                     estadoBrigada: true
 *                     comandoId: "60d5ec49f1a2c8b1f8e4e1a4"
 *                     unidades: ["60d5ec49f1a2c8b1f8e4e1a5"]
 *                   - _id: "60d5ec49f1a2c8b1f8e4e1a6"
 *                     nombreBrigada: "Brigada Beta"
 *                     ubicacionBrigada: "Ciudad B"
 *                     estadoBrigada: true
 *                     comandoId: "60d5ec49f1a2c8b1f8e4e1a7"
 *                     unidades: []
 *       204:
 *         description: No hay brigadas disponibles
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', verifyJWT, verifyRole(['Secretario', 'Instructor', 'Administrador', 'Root']), brigadaController.listarBrigadas);

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
 *             type: object
 *             required:
 *               - nombreBrigada
 *               - ubicacionBrigada
 *               - estadoBrigada
 *               - comandoId
 *             properties:
 *               nombreBrigada:
 *                 type: string
 *               ubicacionBrigada:
 *                 type: string
 *               estadoBrigada:
 *                 type: boolean
 *               comandoId:
 *                 type: string
 *               unidades:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreBrigada: "Brigada Gamma"
 *                 ubicacionBrigada: "Ciudad C"
 *                 estadoBrigada: true
 *                 comandoId: "60d5ec49f1a2c8b1f8e4e1a9"
 *                 unidades: []
 *     responses:
 *       201:
 *         description: Brigada creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brigada'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d5ec49f1a2c8b1f8e4e1a8"
 *                   nombreBrigada: "Brigada Gamma"
 *                   ubicacionBrigada: "Ciudad C"
 *                   estadoBrigada: true
 *                   comandoId: "60d5ec49f1a2c8b1f8e4e1a9"
 *                   unidades: []
 *       400:
 *         description: Datos inválidos
 *       409:
 *         description: Conflicto, brigada ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verifyJWT, verifyRole(['Administrador', 'Root']), brigadaController.crearBrigada);

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
 *         description: ID de la brigada
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la brigada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brigada'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d5ec49f1a2c8b1f8e4e1a3"
 *                   nombreBrigada: "Brigada Alpha"
 *                   ubicacionBrigada: "Ciudad A"
 *                   estadoBrigada: true
 *                   comandoId: "60d5ec49f1a2c8b1f8e4e1a4"
 *                   unidades: ["60d5ec49f1a2c8b1f8e4e1a5"]
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', verifyJWT, verifyRole(['Administrador', 'Root']), brigadaController.obtenerBrigadaPorId);

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
 *             type: object
 *             required:
 *               - nombreBrigada
 *               - ubicacionBrigada
 *               - estadoBrigada
 *               - comandoId
 *             properties:
 *               nombreBrigada:
 *                 type: string
 *               ubicacionBrigada:
 *                 type: string
 *               estadoBrigada:
 *                 type: boolean
 *               comandoId:
 *                 type: string
 *               unidades:
 *                 type: array
 *                 items:
 *                   type: string
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreBrigada: "Brigada Alpha Actualizada"
 *                 ubicacionBrigada: "Ciudad A"
 *                 estadoBrigada: true
 *                 comandoId: "60d5ec49f1a2c8b1f8e4e1a4"
 *                 unidades: ["60d5ec49f1a2c8b1f8e4e1a5"]
 *     responses:
 *       200:
 *         description: Brigada actualizada exitosamente
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', verifyJWT, verifyRole(['Administrador', 'Root']), brigadaController.actualizarBrigada);

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
 *     responses:
 *       200:
 *         description: Brigada desactivada correctamente
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', verifyJWT, verifyRole(['Administrador', 'Root']), brigadaController.desactivarBrigada);

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
 *         description: El ID de la brigada a la que se le agregarán las unidades.
 *         schema:
 *           type: string
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
 *           examples:
 *             ejemplo1:
 *               value:
 *                 unidadIds: [
 *                   "60d21b4667d0d8992e610c81",
 *                 ]
 *     responses:
 *       200:
 *         description: Unidades agregadas correctamente a la brigada.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Brigada'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d21b4667d0d8992e610c84"
 *                   nombreBrigada: "Brigada A"
 *                   unidades: [
 *                     "60d21b4667d0d8992e610c81",
 *                     "60d21b4667d0d8992e610c82"
 *                   ]
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:id/unidades', verifyJWT, verifyRole(['Administrador', 'Root']), brigadaController.agregarUnidades);

module.exports = router;
