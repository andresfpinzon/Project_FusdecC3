const express = require('express');
const router = express.Router();
const brigadaController = require('../controllers/brigada_controllers');

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
 */
router.get('/', brigadaController.listarBrigadas);

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
 *                 description: Nombre de la brigada (mínimo 3 caracteres).
 *               ubicacionBrigada:
 *                 type: string
 *                 description: Ubicación de la brigada (mínimo 3 caracteres).
 *               estadoBrigada:
 *                 type: boolean
 *                 description: Estado de la brigada (activo/inactivo).
 *               comandoId:
 *                 type: string
 *                 description: ID del comando asociado (ObjectId válido).
 *               unidades:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID de las unidades asociadas (ObjectId válido).
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
 */
router.post('/', brigadaController.crearBrigada);

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
 */
router.get('/:id', brigadaController.obtenerBrigadaPorId);

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
 *                 description: Nombre de la brigada (mínimo 3 caracteres).
 *               ubicacionBrigada:
 *                 type: string
 *                 description: Ubicación de la brigada (mínimo 3 caracteres).
 *               estadoBrigada:
 *                 type: boolean
 *                 description: Estado de la brigada (activo/inactivo).
 *               comandoId:
 *                 type: string
 *                 description: ID del comando asociado (ObjectId válido).
 *               unidades:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: ID de las unidades asociadas (ObjectId válido).
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
 */
router.put('/:id', brigadaController.actualizarBrigada);

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
 */
router.delete('/:id', brigadaController.desactivarBrigada);

module.exports = router;