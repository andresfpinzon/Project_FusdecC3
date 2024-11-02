const express = require('express');
const certificadoController = require('../controllers/certificado_controllers');
const router = express.Router();
//const { verifyJWT, verifyRole } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Certificado:
 *       type: object
 *       required:
 *         - nombre
 *         - fechaEmision
 *         - usuarioId
 *         - cursoId
 *         - estudianteId
 *         - nombreEmisorCertificado
 *         - codigoVerificacion
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del certificado.
 *         nombre:
 *           type: string
 *           description: Nombre del certificado.
 *         fechaEmision:
 *           type: string
 *           format: date
 *           description: Fecha de emisión del certificado en formato YYYY-MM-DD.
 *         usuarioId:
 *           type: string
 *           description: ID del usuario que crea el certificado.
 *         cursoId:
 *           type: string
 *           description: ID del curso asociado.
 *         estudianteId:
 *           type: string
 *           description: ID del estudiante asociado.
 *         nombreEmisorCertificado:
 *           type: string
 *           description: Nombre del emisor del certificado.
 *         codigoVerificacion:
 *           type: string
 *           description: Código de verificación del certificado.
 */

/**
 * @swagger
 * tags:
 *   - name: Certificado
 *     description: API para gestionar certificados
 */

/**
 * @swagger
 * /api/certificados:
 *   get:
 *     tags: 
 *       - Certificado
 *     summary: Listar todos los certificados
 *     responses:
 *       200:
 *         description: Lista de certificados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Certificado'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *                     nombre: "Certificado de Participación"
 *                     fechaEmision: "2023-10-01T12:00:00Z"
 *                     usuarioId: "60d5ec49f1a2c8b1f8e4e1a2"
 *                     cursoId: "60d5ec49f1a2c8b1f8e4e1a3"
 *                     estudianteId: "60d5ec49f1a2c8b1f8e4e1a4"
 *                     nombreEmisorCertificado: "Instituto XYZ"
 *                     codigoVerificacion: "ABC123"
 *       400:
 *         description: Datos inválidos
 */
router.get('/', certificadoController.listarCertificados);

/**
 * @swagger
 * /api/certificados:
 *   post:
 *     tags: 
 *       - Certificado
 *     summary: Crear un nuevo certificado
 *     description: Crea un nuevo certificado y genera una auditoría automáticamente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - fechaEmision
 *               - usuarioId
 *               - cursoId
 *               - estudianteId
 *               - nombreEmisorCertificado
 *               - codigoVerificacion
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del certificado.
 *               fechaEmision:
 *                 type: string
 *                 format: date
 *                 description: Fecha de emisión del certificado en formato YYYY-MM-DD.
 *               usuarioId:
 *                 type: string
 *                 description: ID del usuario que crea el certificado.
 *               cursoId:
 *                 type: string
 *                 description: ID del curso asociado.
 *               estudianteId:
 *                 type: string
 *                 description: ID del estudiante asociado.
 *               nombreEmisorCertificado:
 *                 type: string
 *                 description: Nombre del emisor del certificado.
 *               codigoVerificacion:
 *                 type: string
 *                 description: Código de verificación del certificado.
 *     responses:
 *       201:
 *         description: Certificado creado exitosamente; también se genera una auditoría automáticamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 certificado:
 *                   $ref: '#/components/schemas/Certificado'
 *                 auditoria:
 *                   $ref: '#/components/schemas/Auditoria'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   certificado:
 *                     _id: "60d5ec49f1a2c8b1f8e4e1a5"
 *                     nombre: "Certificado de Excelencia"
 *                     fechaEmision: "2023-10-20"
 *                     usuarioId: "60d5ec49f1a2c8b1f8e4e1a2"
 *                     cursoId: "60d5ec49f1a2c8b1f8e4e1a3"
 *                     estudianteId: "60d5ec49f1a2c8b1f8e4e1a4"
 *                     nombreEmisorCertificado: "Instituto XYZ"
 *                     codigoVerificacion: "XYZ456"
 *                   auditoria:
 *                     _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *                     fechaAuditoria: "2023-10-01T12:00:00Z"
 *                     nombreEmisor: "Instituto XYZ"
 *                     certificadoId: "60d5ec49f1a2c8b1f8e4e1a5"
 *                     estadoAuditoria: true
 *       400:
 *         description: Datos inválidos
 */
router.post('/', certificadoController.crearCertificado);


/**
 * @swagger
 * /api/certificados/{id}:
 *   get:
 *     tags: 
 *       - Certificado
 *     summary: Obtener certificado por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del certificado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del certificado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Certificado'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   _id: "60d5ec49f1a2c8b1f8e4e1a1"
 *                   nombre: "Certificado de Participación"
 *                   fechaEmision: "2023-10-01T12:00:00Z"
 *                   usuarioId: "60d5ec49f1a2c8b1f8e4e1a2"
 *                   cursoId: "60d5ec49f1a2c8b1f8e4e1a3"
 *                   estudianteId: "60d5ec49f1a2c8b1f8e4e1a4"
 *                   nombreEmisorCertificado: "Instituto XYZ"
 *                   codigoVerificacion: "ABC123"
 *       404:
 *         description: Certificado no encontrado
 */
router.get('/:id', certificadoController.obtenerCertificadoPorId);

/**
 * @swagger
 * /api/certificados/{id}:
 *   put:
 *     tags: 
 *       - Certificado
 *     summary: Actualizar certificado por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del certificado
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - fechaEmision
 *               - usuarioId
 *               - cursoId
 *               - estudianteId
 *               - nombreEmisorCertificado
 *               - codigoVerificacion
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del certificado.
 *               fechaEmision:
 *                 type: string
 *                 format: date
 *                 description: Fecha de emisión del certificado en formato YYYY-MM-DD.
 *               usuarioId:
 *                 type: string
 *                 description: ID del usuario que crea el certificado.
 *               cursoId:
 *                 type: string
 *                 description: ID del curso asociado.
 *               estudianteId:
 *                 type: string
 *                 description: ID del estudiante asociado.
 *               nombreEmisorCertificado:
 *                 type: string
 *                 description: Nombre del emisor del certificado.
 *               codigoVerificacion:
 *                 type: string
 *                 description: Código de verificación del certificado.
 *     responses:
 *       200:
 *         description: Certificado actualizado exitosamente
 *       404:
 *         description: Certificado no encontrado
 */
router.put('/:id', certificadoController.actualizarCertificado);

/**
 * @swagger
 * /api/certificados/{id}:
 *   delete:
 *     tags: 
 *       - Certificado
 *     summary: Desactivar certificado por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del certificado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Certificado desactivado correctamente
 *       404:
 *         description: Certificado no encontrado
 */
router.delete('/:id', certificadoController.desactivarCertificado);

module.exports = router;
