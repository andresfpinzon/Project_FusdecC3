const express = require('express');
const brigadaController = require('../controllers/brigada_controllers');
const router = express.Router();

/**
 * @swagger
 * /api/brigadas:
 *   get:
 *     summary: Listar todas las brigadas
 *     tags: [Brigada]
 *     responses:
 *       200:
 *         description: Lista de brigadas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   nombreBrigada:
 *                     type: string
 *                   ubicacionBrigada:
 *                     type: string
 *                   comandoId:
 *                     type: string
 */
router.get('/', brigadaController.listarBrigadas);

/**
 * @swagger
 * /api/brigadas:
 *   post:
 *     summary: Crear una nueva brigada
 *     tags: [Brigada]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreBrigada:
 *                 type: string
 *               ubicacionBrigada:
 *                 type: string
 *               comandoId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Brigada creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', brigadaController.crearBrigada);

/**
 * @swagger
 * /api/brigadas/{id}:
 *   get:
 *     summary: Obtener brigada por ID
 *     tags: [Brigada]
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
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 nombreBrigada:
 *                   type: string
 *                 ubicacionBrigada:
 *                   type: string
 *                 comandoId:
 *                   type: string
 *       404:
 *         description: Brigada no encontrada
 */
router.get('/:id', brigadaController.obtenerBrigadaPorId);

/**
 * @swagger
 * /api/brigadas/{id}:
 *   put:
 *     summary: Actualizar brigada por ID
 *     tags: [Brigada]
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
 *             properties:
 *               nombreBrigada:
 *                 type: string
 *               ubicacionBrigada:
 *                 type: string
 *               comandoId:
 *                 type: string
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
 *     summary: Desactivar brigada por ID
 *     tags: [Brigada]
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