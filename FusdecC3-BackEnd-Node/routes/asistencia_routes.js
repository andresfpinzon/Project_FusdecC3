const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistencia_controllers'); 
const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Asistencia:
 *       type: object
 *       required:
 *         - tituloAsistencia
 *         - fechaAsistencia
 *         - usuarioId
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado de la asistencia.
 *         tituloAsistencia:
 *           type: string
 *           description: Título de la asistencia.
 *         fechaAsistencia:
 *           type: string
 *           format: date
 *           description: Fecha de la asistencia.
 *         usuarioId:
 *           type: string
 *           description: ID del usuario responsable.
 *         estadoAsistencia:
 *           type: boolean
 *           description: Estado de la asistencia (activa/inactiva).
 *           default: true
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs de los estudiantes que asistieron.
 */

/**
 * @swagger
 * tags:
 *   - name: Asistencias
 *     description: API para gestionar asistencias
 */

/**
 * @swagger
 * /api/asistencias:
 *   get:
 *     tags: 
 *       - Asistencias
 *     summary: Obtener una lista de asistencias activas
 *     responses:
 *       200:
 *         description: Una colección de asistencias activas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Asistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                     tituloAsistencia: "Asistencia 17/10/2024 SS 2024-1"
 *                     fechaAsistencia: "17-10-2024"
 *                     usuarioId: "usuario123"
 *                     estadoAsistencia: true
 *                     estudiantes: ["estudiante1", "estudiante2"]
 */
router.get('/', verifyJWT, verifyRole(['Instructor']), asistenciaController.listarAsistencias);

/**
 * @swagger
 * /api/asistencias:
 *   post:
 *     tags: 
 *       - Asistencias
 *     summary: Crear una asistencia
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asistencia'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 tituloAsistencia: "Asistencia 18/10/2024 SS 2024-1"
 *                 fechaAsistencia: "18-10-2024"
 *                 usuarioId: "usuario456"
 *                 estadoAsistencia: true
 *                 estudiantes: ["estudiante3", "estudiante4"]
 *     responses:
 *       201:
 *         description: Asistencia creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   tituloAsistencia: "Asistencia 18/10/2024 SS 2024-1"
 *                   fechaAsistencia: "18-10-2024"
 *                   usuarioId: "usuario456"
 *                   estadoAsistencia: true
 *                   estudiantes: ["estudiante3", "estudiante4"]
 */
router.post('/', verifyJWT, verifyRole(['Instructor']), asistenciaController.crearAsistencia);
//router.post('/', asistenciaController.crearAsistencia);

/**
 * @swagger
 * /api/asistencias/{id}:
 *   put:
 *     tags: 
 *       - Asistencias
 *     summary: Actualizar una asistencia mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la asistencia a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Asistencia'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 tituloAsistencia: "Asistencia 18/10/2024 SS 2024-1"
 *                 fechaAsistencia: "18-10-2024"
 *                 usuarioId: "usuario456"
 *                 estadoAsistencia: true
 *                 estudiantes: ["estudiante5", "estudiante6"]
 *     responses:
 *       200:
 *         description: Asistencia actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   tituloAsistencia: "Asistencia 18/10/2024 SS 2024-1"
 *                   fechaAsistencia: "18-10-2024"
 *                   usuarioId: "usuario456"
 *                   estadoAsistencia: true
 *                   estudiantes: ["estudiante5", "estudiante6"]
 *       404:
 *         description: Asistencia no encontrada.
 */
router.put('/:id', asistenciaController.actualizarAsistencia);

/**
 * @swagger
 * /api/asistencias/{id}:
 *   delete:
 *     tags: 
 *       - Asistencias
 *     summary: Desactivar una asistencia mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la asistencia a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asistencia desactivada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   tituloAsistencia: "Asistencia 18/10/2024 SS 2024-1"
 *                   fechaAsistencia: "18-10-2024"
 *                   usuarioId: "usuario456"
 *                   estadoAsistencia: false
 *                   estudiantes: []
 *       404:
 *         description: Asistencia no encontrada.
 */
router.delete('/:id', asistenciaController.desactivarAsistencia);

/**
 * @swagger
 * /api/asistencias/{id}:
 *   get:
 *     tags: 
 *       - Asistencias
 *     summary: Obtener una asistencia mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la asistencia
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asistencia obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Asistencia'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   tituloAsistencia: "Asistencia 18/10/2024 SS 2024-1"
 *                   fechaAsistencia: "18-10-2024"
 *                   usuarioId: "usuario456"
 *                   estadoAsistencia: true
 *                   estudiantes: ["estudiante3", "estudiante4"]
 *       404:
 *         description: Asistencia no encontrada.
 */
router.get('/:id', asistenciaController.obtenerAsistenciaPorId);

module.exports = router;

