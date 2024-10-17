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

module.exports = router;
