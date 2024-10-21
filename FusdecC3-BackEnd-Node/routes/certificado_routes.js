const express = require('express');
const certificadoController = require('../controllers/certificado_controllers');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Certificado:
 *       type: object
 *       required:
 *         - nombre
 *         - fechaEmision
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado del certificado.
 *         nombre:
 *           type: string
 *           description: Nombre del certificado.
 *         fechaEmision:
 *           type: string
 *           format: date-time
 *           description: Fecha de emisión del certificado.
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
 *                   - _id: "60d5ec49f1a2c8b1f8e4e1a2"
 *                     nombre: "Certificado de Asistencia"
 *                     fechaEmision: "2023-10-02T12:00:00Z"
 */
router.get('/', certificadoController.listarCertificados);

/**
 * @swagger
 * /api/certificados:
 *   post:
 *     tags: 
 *       - Certificado
 *     summary: Crear un nuevo certificado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - fechaEmision
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del certificado.
 *               fechaEmision:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de emisión del certificado.
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombre: "Certificado de Excelencia"
 *                 fechaEmision: "2023-10-20T14:00:00Z"
 *     responses:
 *       201:
 *         description: Certificado creado exitosamente, se genera una auditoría automáticamente.
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
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del certificado.
 *               fechaEmision:
 *                 type: string
 *                 format: date-time
 *                 description: Fecha de emisión del certificado.
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombre: "Certificado de Participación Actualizado"
 *                 fechaEmision: "2023-10-21T14:00:00Z"
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