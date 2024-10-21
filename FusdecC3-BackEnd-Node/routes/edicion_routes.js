const express = require("express");
const router = express.Router();
const edicionController = require("../controllers/edicion_controllers");
//const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Edicion:
 *       type: object
 *       required:
 *         - tituloEdicion
 *         - fechaInicioEdicion
 *         - fechaFinEdicion
 *         - cursoId
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado de la edición.
 *         tituloEdicion:
 *           type: string
 *           description: Título de la edición.
 *         fechaInicioEdicion:
 *           type: string
 *           format: date
 *           description: Fecha de inicio de la edición.
 *         fechaFinEdicion:
 *           type: string
 *           format: date
 *           description: Fecha de fin de la edición.
 *         estadoEdicion:
 *           type: boolean
 *           description: Estado de la edición (activa/inactiva).
 *           default: true
 *         cursoId:
 *           type: string
 *           description: ID del curso asociado.
 *         horarios:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs de los horarios relacionados.
 *         estudiantes:
 *           type: array
 *           items:
 *             type: string
 *             description: IDs de los estudiantes inscritos.
 */

/**
 * @swagger
 * tags:
 *   - name: Ediciones
 *     description: API para gestionar ediciones
 */

/**
 * @swagger
 * /api/ediciones:
 *   get:
 *     tags:
 *       - Ediciones
 *     summary: Obtener una lista de ediciones activas
 *     responses:
 *       200:
 *         description: Una colección de ediciones activas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Edicion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                     tituloEdicion: "Edición 2024-1"
 *                     fechaInicioEdicion: "2024-01-10"
 *                     fechaFinEdicion: "2024-06-30"
 *                     estadoEdicion: true
 *                     cursoId: "curso123"
 *                     horarios: ["horario1", "horario2"]
 *                     estudiantes: ["estudiante1", "estudiante2"]
 */
router.get("/", edicionController.listarEdicionesActivas);

/**
 * @swagger
 * /api/ediciones:
 *   post:
 *     tags:
 *       - Ediciones
 *     summary: Crear una edición
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Edicion'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 tituloEdicion: "Edición 2024-2"
 *                 fechaInicioEdicion: "2024-07-01"
 *                 fechaFinEdicion: "2024-12-31"
 *                 estadoEdicion: true
 *                 cursoId: "curso456"
 *                 horarios: ["horario3", "horario4"]
 *                 estudiantes: ["estudiante3", "estudiante4"]
 *     responses:
 *       201:
 *         description: Edición creada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Edicion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   tituloEdicion: "Edición 2024-2"
 *                   fechaInicioEdicion: "2024-07-01"
 *                   fechaFinEdicion: "2024-12-31"
 *                   estadoEdicion: true
 *                   cursoId: "curso456"
 *                   horarios: ["horario3", "horario4"]
 *                   estudiantes: ["estudiante3", "estudiante4"]
 */
router.post("/", edicionController.crearEdicion);

/**
 * @swagger
 * /api/ediciones/{id}:
 *   put:
 *     tags:
 *       - Ediciones
 *     summary: Actualizar una edición mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la edición a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Edicion'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 fechaInicioEdicion: "2024-07-01"
 *                 fechaFinEdicion: "2025-01-01"
 *                 horarios: ["horario5", "horario6"]
 *                 estudiantes: ["estudiante5", "estudiante6"]
 *     responses:
 *       200:
 *         description: Edición actualizada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Edicion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   tituloEdicion: "Edición 2024-2"
 *                   fechaInicioEdicion: "2024-07-01"
 *                   fechaFinEdicion: "2025-01-01"
 *                   estadoEdicion: true
 *                   cursoId: "curso456"
 *                   horarios: ["horario5", "horario6"]
 *                   estudiantes: ["estudiante5", "estudiante6"]
 *       404:
 *         description: Edición no encontrada.
 */
router.put("/:id", edicionController.actualizarEdicion);

/**
 * @swagger
 * /api/ediciones/{id}:
 *   delete:
 *     tags:
 *       - Ediciones
 *     summary: Desactivar una edición mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la edición a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edición desactivada correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Edicion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   tituloEdicion: "Edición 2024-2"
 *                   fechaInicioEdicion: "2024-07-01"
 *                   fechaFinEdicion: "2025-01-01"
 *                   estadoEdicion: false
 *                   cursoId: "curso456"
 *                   horarios: []
 *                   estudiantes: []
 *       404:
 *         description: Edición no encontrada.
 */
router.delete("/:id", edicionController.desactivarEdicion);

/**
 * @swagger
 * /api/ediciones/{id}:
 *   get:
 *     tags:
 *       - Ediciones
 *     summary: Obtener una edición mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la edición
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edición obtenida correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Edicion'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   tituloEdicion: "Edición 2024-2"
 *                   fechaInicioEdicion: "2024-07-01"
 *                   fechaFinEdicion: "2025-01-01"
 *                   estadoEdicion: true
 *                   cursoId: "curso456"
 *                   horarios: ["horario5", "horario6"]
 *                   estudiantes: ["estudiante5", "estudiante6"]
 *       404:
 *         description: Edición no encontrada.
 */
router.get("/:id", edicionController.obtenerEdicionPorId);

module.exports = router;
