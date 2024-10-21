const express = require('express');
const auditoriaController = require('../controllers/auditoria_controllers');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Auditoria:
 *       type: object
 *       required:
 *         - fechaAuditoria
 *         - nombreEmisor
 *         - certificadoId
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado de la auditoría.
 *         fechaAuditoria:
 *           type: string
 *           format: date-time
 *           description: Fecha de la auditoría.
 *         nombreEmisor:
 *           type: string
 *           description: Nombre del emisor de la auditoría.
 *         certificadoId:
 *           type: string
 *           description: ID del certificado asociado (ObjectId).
 *           pattern: '^[0-9a-fA-F]{24}$'
 */

/**
 * @swagger
 * tags:
 *   - name: Auditoría
 *     description: API para gestionar auditorías
 */

/**
 * @swagger
 * /api/auditorias:
 *   get:
 *     tags: 
 *       - Auditoría
 *     summary: Listar todas las auditorías
 *     responses:
 *       200:
 *         description: Lista de auditorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auditoria'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *                     fechaAuditoria: "2023-10-01T12:00:00Z"
 *                     nombreEmisor: "Carlos Martínez"
 *                     certificadoId: "60d5ec49f1a2c8b1f8e4e1a1"
 *                   - _id: "60d5ec49f1a2c8b1f8e4e1a2"
 *                     fechaAuditoria: "2023-10-02T12:00:00Z"
 *                     nombreEmisor: "Ana Gómez"
 *                     certificadoId: "60d5ec49f1a2c8b1f8e4e1a2"
 */
router.get('/', auditoriaController.listarAuditorias);

/**
 * @swagger
 * /api/auditorias:
 *   post:
 *     tags: 
 *       - Auditoría
 *     summary: Crear una nueva auditoría
 *     description: Crea una nueva auditoría asociada a un certificado y la registra en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuditoriaCreate'
 *     responses:
 *       201:
 *         description: Auditoría creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *                   fechaAuditoria: "2023-10-01T12:00:00Z"
 *                   nombreEmisor: "Carlos Martínez"
 *                   certificadoId: "60d5ec49f1a2c8b1f8e4e1a1"
 *                   estadoAuditoria: true
 *       400:
 *         description: Error de validación en los datos de entrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El certificado ya está registrado en una auditoría existente"
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', auditoriaController.crearAuditoria);

/**
 * @swagger
 * /api/auditorias/{id}:
 *   get:
 *     tags: 
 *       - Auditoría
 *     summary: Obtener auditoría por ID
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
 *               $ref: '#/components/schemas/Auditoria'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *                   fechaAuditoria: "2023-10-01T12:00:00Z"
 *                   nombreEmisor: "Carlos Martínez"
 *                   certificadoId: "60d5ec49f1a2c8b1f8e4e1a1"
 *       404:
 *         description: Auditoría no encontrada
 */
router.get('/:id', auditoriaController.obtenerAuditoriaPorId);

/**
 * @swagger
 * /api/auditorias/{id}:
 *   delete:
 *     tags: 
 *       - Auditoría
 *     summary: Desactivar una auditoría por su ID
 *     description: Cambia el estado de una auditoría a inactivo.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la auditoría a desactivar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auditoría desactivada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auditoria'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *                   nombreEmisor: "pedro perez"
 *                   estadoAuditoria: true
 *                   fechaAuditoria: "2023-10-01T12:00:00Z"
 *                   certificadoId: "60d5ec49f1a2c8b1f8e4e1a1"
 *       404:
 *         description: Auditoría no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:id', auditoriaController.desactivarAuditoria);

module.exports = router;
