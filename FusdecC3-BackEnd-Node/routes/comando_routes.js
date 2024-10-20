const express = require('express');
const comandoControllers = require('../controllers/comando_controllers'); // Importa el controlador
const router = express.Router(); // Define el enrutador

/**
 * @swagger
 * components:
 *   schemas:
 *     Comando:
 *       type: object
 *       required:
 *         - nombreComando
 *         - estadoComando
 *         - ubicacionComando
 *         - fundacionId
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del comando.
 *         nombreComando:
 *           type: string
 *           description: Nombre del comando.
 *         estadoComando:
 *           type: boolean
 *           description: Estado del comando (activo/inactivo).
 *           default: true
 *         ubicacionComando:
 *           type: string
 *           description: Ubicación del comando.
 *         fundacionId:
 *           type: string
 *           description: ID de la fundación a la que pertenece el comando.
 *         brigadas:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de las brigadas asociadas al comando.
 */

// Listar todos los comandos
/**
 * @swagger
 * /api/comandos:
 *   get:
 *     summary: Lista todos los comandos
 *     tags: [Comandos]
 *     responses:
 *       200:
 *         description: Lista de comandos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comando'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "63f7d2bbf1a2b4b5c3cdb900"
 *                     nombreComando: "Comando de Rescate"
 *                     estadoComando: true
 *                     ubicacionComando: "Sector 5, Zona Norte"
 *                     fundacionId: "63f7d2bbf1a2b4b5c3cdb901"
 *                     brigadas: ["63f7d2bbf1a2b4b5c3cdb902"]
 *                   - id: "63f7d2bbf1a2b4b5c3cdb901"
 *                     nombreComando: "Comando de Emergencia"
 *                     estadoComando: false
 *                     ubicacionComando: "Sector 3, Zona Sur"
 *                     fundacionId: "63f7d2bbf1a2b4b5c3cdb903"
 *                     brigadas: ["63f7d2bbf1a2b4b5c3cdb904"]
 */
router.get('/', comandoControllers.listarComandos);

// Obtener comando por Id
/**
 * @swagger
 * /api/comandos/{id}:
 *   get:
 *     summary: Obtener un comando por ID
 *     tags: [Comandos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comando
 *     responses:
 *       200:
 *         description: Comando encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comando'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "63f7d2bbf1a2b4b5c3cdb900"
 *                   nombreComando: "Comando de Rescate"
 *                   estadoComando: true
 *                   ubicacionComando: "Sector 5, Zona Norte"
 *                   fundacionId: "63f7d2bbf1a2b4b5c3cdb901"
 *                   brigadas: ["63f7d2bbf1a2b4b5c3cdb902"]
 *       404:
 *         description: Comando no encontrado
 */
router.get('/:id', comandoControllers.obtenerComandoPorId);

// Crear un comando
/**
 * @swagger
 * /api/comandos:
 *   post:
 *     summary: Crear un nuevo comando
 *     tags: [Comandos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comando'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreComando: "Comando de Emergencia"
 *                 estadoComando: true
 *                 ubicacionComando: "Sector 5, Zona Norte"
 *                 fundacionId: "63f7d2bbf1a2b4b5c3cdb901"
 *                 brigadas: ["63f7d2bbf1a2b4b5c3cdb902"]
 *     responses:
 *       201:
 *         description: Comando creado exitosamente
 *       400:
 *         description: Datos inválidos en la solicitud
 */
router.post('/', comandoControllers.crearComando);

// Actualizar comando
/**
 * @swagger
 * /api/comandos/{id}:
 *   put:
 *     summary: Actualizar un comando
 *     tags: [Comandos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comando
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comando'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreComando: "Comando de Rescate Actualizado"
 *                 estadoComando: false
 *                 ubicacionComando: "Sector 5, Zona Norte"
 *                 fundacionId: "63f7d2bbf1a2b4b5c3cdb901"
 *                 brigadas: ["63f7d2bbf1a2b4b5c3cdb902"]
 *     responses:
 *       200:
 *         description: Comando actualizado con éxito
 *       404:
 *         description: Comando no encontrado
 */
router.put('/:id', comandoControllers.editarComando);

// Desactivar comando
/**
 * @swagger
 * /api/comandos/{id}:
 *   delete:
 *     summary: Desactivar un comando existente
 *     tags: [Comandos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del comando a desactivar
 *     responses:
 *       200:
 *         description: Comando desactivado exitosamente
 *       404:
 *         description: Comando no encontrado
 */
router.delete('/:id', comandoControllers.desactivarComando);

module.exports = router;