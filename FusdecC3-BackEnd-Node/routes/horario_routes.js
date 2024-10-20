const express = require("express");
const router = express.Router();
const horarioController = require("../controllers/horario_controllers");

/**
 * @swagger
 * components:
 *   schemas:
 *     Horario:
 *       type: object
 *       required:
 *         - tituloHorario
 *         - horaInicio
 *         - horaFin
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del horario.
 *         tituloHorario:
 *           type: string
 *           description: Título del horario.
 *         horaInicio:
 *           type: string
 *           format: time
 *           description: Hora de inicio del horario en formato HH:mm.
 *         horaFin:
 *           type: string
 *           format: time
 *           description: Hora de fin del horario en formato HH:mm.
 *         estadoHorario:
 *           type: boolean
 *           description: Estado del horario (activo/inactivo).
 *           default: true
 */

/**
 * @swagger
 * tags:
 *   - name: Horarios
 *     description: API para gestionar horarios
 */

/**
 * @swagger
 * /api/horarios:
 *   get:
 *     tags:
 *       - Horarios
 *     summary: Obtener una lista de horarios activos
 *     responses:
 *       200:
 *         description: Una colección de horarios activos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Horario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "61f7d2bbf1a2b4b5c3cdb71d"
 *                     tituloHorario: "Horario Matutino"
 *                     horaInicio: "08:00"
 *                     horaFin: "12:00"
 *                     estadoHorario: true
 */
router.get("/", horarioController.listarHorariosActivos);

/**
 * @swagger
 * /api/horarios:
 *   post:
 *     tags:
 *       - Horarios
 *     summary: Crear un horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horario'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 tituloHorario: "Horario Vespertino"
 *                 horaInicio: "13:00"
 *                 horaFin: "17:00"
 *                 estadoHorario: true
 *     responses:
 *       201:
 *         description: Horario creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71e"
 *                   tituloHorario: "Horario Vespertino"
 *                   horaInicio: "13:00"
 *                   horaFin: "17:00"
 *                   estadoHorario: true
 */
router.post("/", horarioController.crearHorario);

/**
 * @swagger
 * /api/horarios/{id}:
 *   put:
 *     tags:
 *       - Horarios
 *     summary: Actualizar un horario mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del horario a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Horario'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 tituloHorario: "Horario Vespertino Actualizado"
 *                 horaInicio: "14:00"
 *                 horaFin: "18:00"
 *                 estadoHorario: true
 *     responses:
 *       200:
 *         description: Horario actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   tituloHorario: "Horario Vespertino Actualizado"
 *                   horaInicio: "14:00"
 *                   horaFin: "18:00"
 *                   estadoHorario: true
 *       404:
 *         description: Horario no encontrado.
 */
router.put("/:id", horarioController.actualizarHorario);

/**
 * @swagger
 * /api/horarios/{id}:
 *   delete:
 *     tags:
 *       - Horarios
 *     summary: Desactivar un horario mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del horario a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horario desactivado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   tituloHorario: "Horario Vespertino"
 *                   horaInicio: "13:00"
 *                   horaFin: "17:00"
 *                   estadoHorario: false
 *       404:
 *         description: Horario no encontrado.
 */
router.delete("/:id", horarioController.desactivarHorario);

/**
 * @swagger
 * /api/horarios/{id}:
 *   get:
 *     tags:
 *       - Horarios
 *     summary: Obtener un horario mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del horario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Horario obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "61f7d2bbf1a2b4b5c3cdb71f"
 *                   tituloHorario: "Horario Matutino"
 *                   horaInicio: "08:00"
 *                   horaFin: "12:00"
 *                   estadoHorario: true
 *       404:
 *         description: Horario no encontrado.
 */
router.get("/:id", horarioController.obtenerHorarioPorId);

module.exports = router;
