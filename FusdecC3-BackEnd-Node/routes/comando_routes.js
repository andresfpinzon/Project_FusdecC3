const express = require('express');
const comandoControllers = require('../controllers/comando_controllers');
const router = express.Router();
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Comando:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del comando
 *         nombreComando:
 *           type: string
 *           description: Nombre del comando
 *         estadoComando:
 *           type: boolean
 *           description: Estado del comando (activo/inactivo)
 *         ubicacionComando:
 *           type: string
 *           description: Ubicación del comando
 *         fundacionId:
 *           type: string
 *           description: ID de la fundación asociada
 *         brigadas:
 *           type: array
 *           items:
 *             type: string
 *             description: ID de brigada asociada

 *     ComandoCreate:
 *       type: object
 *       required:
 *         - nombreComando
 *         - estadoComando
 *         - ubicacionComando
 *         - fundacionId
 *       properties:
 *         nombreComando:
 *           type: string
 *           description: Nombre del comando
 *         estadoComando:
 *           type: boolean
 *           description: Estado del comando (activo/inactivo)
 *           default: true
 *         ubicacionComando:
 *           type: string
 *           description: Ubicación del comando
 *         fundacionId:
 *           type: string
 *           description: ID de la fundación asociada

 *     ComandoUpdate:
 *       type: object
 *       properties:
 *         nombreComando:
 *           type: string
 *           description: Nombre del comando
 *         estadoComando:
 *           type: boolean
 *           description: Estado del comando (activo/inactivo)
 *         ubicacionComando:
 *           type: string
 *           description: Ubicación del comando
 *         fundacionId:
 *           type: string
 *           description: ID de la fundación asociada
 */

/**
 * @swagger
 * tags:
 *   - name: Comando
 *     description: API para gestionar comandos
 */

/**
 * @swagger
 * /api/comandos:
 *   get:
 *     tags:
 *       - Comando
 *     summary: Obtener todos los comandos
 *     responses:
 *       200:
 *         description: Lista de comandos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comando'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', verifyJWT, verifyRole(['Secretario', 'Instructor', 'Administrativo', 'Root']), comandoControllers.listarComandos);

/**
 * @swagger
 * /api/comandos:
 *   post:
 *     tags: 
 *       - Comando
 *     summary: Crear un nuevo comando
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComandoCreate'
 *     responses:
 *       201:
 *         description: Comando creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comando'
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', verifyJWT, verifyRole(['Administrativo', 'Root']), comandoControllers.crearComando);

/**
 * @swagger
 * /api/comandos/{id}:
 *   put:
 *     tags: 
 *       - Comando
 *     summary: Actualizar comando por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comando
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ComandoUpdate'
 *     responses:
 *       200:
 *         description: Comando actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comando'
 *       404:
 *         description: Comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), comandoControllers.actualizarComando);

/**
 * @swagger
 * /api/comandos/{id}:
 *   get:
 *     tags:
 *       - Comando
 *     summary: Obtener comando por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comando a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comando obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comando'
 *       404:
 *         description: Comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), comandoControllers.obtenerComandoPorId);

/**
 * @swagger
 * /api/comandos/{id}:
 *   delete:
 *     tags: 
 *       - Comando
 *     summary: Desactivar comando por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comando
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comando desactivado correctamente
 *       404:
 *         description: Comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', verifyJWT, verifyRole(['Administrativo', 'Root']), comandoControllers.desactivarComando);

/**
 * @swagger
 * /api/comandos/{id}/brigadas:
 *   post:
 *     tags:
 *       - Comando
 *     summary: Agregar brigadas a un comando
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comando
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               brigadasIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de las brigadas a agregar
 *     responses:
 *       200:
 *         description: Brigadas agregadas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comando'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/:id/brigadas', verifyJWT, verifyRole(['Administrativo', 'Root']), comandoControllers.agregarBrigadasAComandos);

module.exports = router;