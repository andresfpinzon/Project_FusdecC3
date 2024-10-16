const express = require('express');
const auditoriaController = require('../controllers/auditoria_controllers');
const router = express.Router();

/**
 * @swagger
 * /api/auditorias:
 *   get:
 *     summary: Listar todas las auditorías
 *     tags: [Auditoría]
 *     responses:
 *       200:
 *         description: Lista de auditorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   fechaAuditoria:
 *                     type: string
 *                     format: date-time
 *                   nombreEmisor:
 *                     type: string
 *                   certificadoId:
 *                     type: string
 */
router.get('/', auditoriaController.listarAuditorias);

/**
 * @swagger
 * /api/auditorias:
 *   post:
 *     summary: Crear una nueva auditoría
 *     tags: [Auditoría]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaAuditoria:
 *                 type: string
 *                 format: date-time
 *               nombreEmisor:
 *                 type: string
 *               certificadoId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Auditoría creada exitosamente
 *       400:
 *         description: Datos inválidos
 */
router.post('/', auditoriaController.crearAuditoria);

/**
 * @swagger
 * /api/auditorias/{id}:
 *   get:
 *     summary: Obtener auditoría por ID
 *     tags: [Auditoría]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la auditoría
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la auditoría
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 fechaAuditoria:
 *                   type: string
 *                   format: date-time
 *                 nombreEmisor:
 *                   type: string
 *                 certificadoId:
 *                   type: string
 *       404:
 *         description: Auditoría no encontrada
 */
router.get('/:id', auditoriaController.obtenerAuditoriaPorId);

/**
 * @swagger
 * /api/auditorias/{id}:
 *   put:
 *     summary: Actualizar auditoría por ID
 *     tags: [Auditoría]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la auditoría
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fechaAuditoria:
 *                 type: string
 *                 format: date-time
 *               nombreEmisor:
 *                 type: string
 *               certificadoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Auditoría actualizada exitosamente
 *       404:
 *         description: Auditoría no encontrada
 */
router.put('/:id', auditoriaController.actualizarAuditoria);

/**
 * @swagger
 * /api/auditorias/{id}:
 *   delete:
 *     summary: Desactivar auditoría por ID
 *     tags: [Auditoría]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la auditoría
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auditoría desactivada correctamente
 *       404:
 *         description: Auditoría no encontrada
 */
router.delete('/:id', auditoriaController.desactivarAuditoria);

/**
 * @swagger
 * /api/auditorias/{id}/usuarios:
 *   get:
 *     summary: Obtener usuarios asociados a una auditoría
 *     tags: [Auditoría]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la auditoría
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de usuarios asociados a la auditoría
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: No se encontraron usuarios para la auditoría
 */
router.get('/:id/usuarios', auditoriaController.obtenerUsuariosPorAuditoria);

module.exports = router;