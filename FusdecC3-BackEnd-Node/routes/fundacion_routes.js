const express = require('express');
const router = express.Router();
const fundacionController = require('../controllers/fundacion_controllers');
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

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
router.get('/', verifyJWT, verifyRole(['Root','Administrativo','secretario']), fundacionController.listarFundaciones);

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
router.post('/',verifyJWT, verifyRole(['Root']), fundacionController.crearFundacion);

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
router.get('/:id',verifyJWT, verifyRole(['Root']), fundacionController.obtenerFundacionPorId);

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
router.put('/:id',verifyJWT, verifyRole(['Root']), fundacionController.actualizarFundacion);

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
router.delete('/:id',verifyJWT, verifyRole(['Root']), fundacionController.desactivarFundacion);

/**
 * @swagger
 * /api/fundaciones/{id}/comandos:
 *   post:
 *     tags:
 *       - Fundaciones
 *     summary: Asignar un comando a una fundación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la fundación
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comandoId
 *             properties:
 *               comandoId:
 *                 type: string
 *                 description: ID del comando a asignar
 *     responses:
 *       200:
 *         description: Comando asignado correctamente
 *       404:
 *         description: Fundación o comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:id/comandos', verifyJWT, verifyRole(['Root']), fundacionController.asignarComando);

/**
 * @swagger
 * /api/fundaciones/{id}/comandos/{comandoId}:
 *   delete:
 *     tags:
 *       - Fundaciones
 *     summary: Desasignar un comando de una fundación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la fundación
 *         schema:
 *           type: string
 *       - in: path
 *         name: comandoId
 *         required: true
 *         description: ID del comando a desasignar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comando desasignado correctamente
 *       404:
 *         description: Fundación o comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id/comandos/:comandoId', verifyJWT, verifyRole(['Root']), fundacionController.desasignarComando);

/**
 * @swagger
 * /api/fundaciones/{id}/comandos:
 *   get:
 *     tags:
 *       - Fundaciones
 *     summary: Obtener comandos asignados a una fundación
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la fundación
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comandos asignados
 *       404:
 *         description: Fundación no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id/comandos', verifyJWT, verifyRole(['Root']), fundacionController.obtenerComandosAsignados);

module.exports = router;
