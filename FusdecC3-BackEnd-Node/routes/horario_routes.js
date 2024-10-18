const express = require("express");
const router = express.Router();
const horarioController = require("../controllers/horario_controllers");

/**
 * @swagger
 * /horarios:
 *   get:
 *     summary: Listar horarios activos
 *     responses:
 *       200:
 *         description: Lista de horarios activos.
 *       204:
 *         description: No hay horarios activos.
 */
router.get("/", horarioController.listarHorariosActivos);

/**
 * @swagger
 * /horarios/{id}:
 *   get:
 *     summary: Obtener un horario por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario encontrado.
 *       404:
 *         description: Horario no encontrado.
 */
router.get("/:id", horarioController.obtenerHorarioPorId);

/**
 * @swagger
 * /horarios:
 *   post:
 *     summary: Crear un nuevo horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tituloHorario:
 *                 type: string
 *               horaInicio:
 *                 type: string
 *                 example: "08:00"
 *               horaFin:
 *                 type: string
 *                 example: "12:00"
 *               estadoHorario:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Horario creado exitosamente.
 *       400:
 *         description: Datos inválidos.
 *       409:
 *         description: El horario ya existe.
 */
router.post("/", horarioController.crearHorario);

/**
 * @swagger
 * /horarios/{id}:
 *   put:
 *     summary: Actualizar un horario existente
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tituloHorario:
 *                 type: string
 *               horaInicio:
 *                 type: string
 *               horaFin:
 *                 type: string
 *               estadoHorario:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Horario actualizado.
 *       404:
 *         description: Horario no encontrado.
 *       400:
 *         description: Datos inválidos.
 */
router.put("/:id", horarioController.actualizarHorario);

/**
 * @swagger
 * /horarios/{id}:
 *   delete:
 *     summary: Desactivar un horario
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario desactivado.
 *       404:
 *         description: Horario no encontrado.
 */
router.delete("/:id", horarioController.desactivarHorario);

module.exports = router;
