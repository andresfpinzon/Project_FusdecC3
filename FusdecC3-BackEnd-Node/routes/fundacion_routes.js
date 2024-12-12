const express = require('express');
const router = express.Router();
const fundacionController = require('../controllers/fundacion_controllers');

/**
* @swagger
 * components:
 *   schemas:
 *     Fundacion:
 *       type: object
 *       required:
 *         - nombreFundacion
 *         - estadoFundacion
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado de la fundación.
 *         nombreFundacion:
 *           type: string
 *           description: Nombre de la fundación.
 *           example: "FUSDEC"
 *         estadoFundacion:
 *           type: boolean
 *           description: Estado de la fundación (activa/inactiva).
 *           default: true
 *         comando:
 *           type: array
 *           items:
 *             type: string
 *             description: ID de comando asociado a la fundación.
 */

/**
 * @swagger
 * tags:
 *   - name: Fundaciones
 *     description: API para gestionar fundaciones
 */

/**
 * @swagger
 * /api/fundaciones:
 *   get:
 *     tags:
 *       - Fundaciones
 *     summary: Obtener una lista de fundaciones
 *     responses:
 *       200:
 *         description: Una colección de fundaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fundacion'
 */
router.get('/', fundacionController.listarFundaciones);

/**
 * @swagger
 * /api/fundaciones:
 *   post:
 *     tags:
 *       - Fundaciones
 *     summary: Crear una nueva fundación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fundacion'
 *     responses:
 *       201:
 *         description: Fundación creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fundacion'
 */
router.post('/', fundacionController.crearFundacion);

/**
 * @swagger
 * /api/fundaciones/{id}:
 *   get:
 *     tags:
 *       - Fundaciones
 *     summary: Obtener una fundación mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la fundación.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fundación obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fundacion'
 *       404:
 *         description: Fundación no encontrada.
 */
router.get('/:id', fundacionController.obtenerFundacionPorId);

/**
 * @swagger
 * /api/fundaciones/{id}:
 *   put:
 *     tags:
 *       - Fundaciones
 *     summary: Actualizar una fundación mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la fundación a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fundacion'
 *     responses:
 *       200:
 *         description: Fundación actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fundacion'
 *       404:
 *         description: Fundación no encontrada.
 */
router.put('/:id', fundacionController.actualizarFundacion);

/**
 * @swagger
 * /api/fundaciones/{id}:
 *   delete:
 *     tags:
 *       - Fundaciones
 *     summary: Desactivar una fundación mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la fundación a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fundación desactivada correctamente.
 *       404:
 *         description: Fundación no encontrada.
 */
router.delete('/:id', fundacionController.desactivarFundacion);

/**
 * @swagger
 * /api/fundaciones/{fundacionId}/comandos:
 *   post:
 *     tags:
 *       - Fundaciones
 *     summary: Agregar comandos a una fundación
 *     parameters:
 *       - in: path
 *         name: fundacionId
 *         required: true
 *         description: El ID de la fundación a la que se le agregarán los comandos.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comandosIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Comandos agregados correctamente a la fundación.
 *       404:
 *         description: Fundación no encontrada.
 */
router.post('/:fundacionId/comandos', fundacionController.agregarComandos);

module.exports = router;
