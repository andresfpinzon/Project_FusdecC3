const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email_controller');
const { verifyJWT } = require('../config/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Email:
 *       type: object
 *       required:
 *         - to
 *         - subject
 *         - text
 *       properties:
 *         to:
 *           type: string
 *           description: Dirección de correo electrónico del destinatario.
 *         subject:
 *           type: string
 *           description: Asunto del correo electrónico.
 *         text:
 *           type: string
 *           description: Contenido del correo electrónico.
 */

/**
 * @swagger
 * tags:
 *   - name: Emails
 *     description: API para enviar correos electrónicos
 */

/**
 * @swagger
 * /api/enviar-correo:
 *   post:
 *     tags:
 *       - Emails
 *     summary: Enviar correo electrónico
 *     description: Envía un correo electrónico al destinatario especificado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Email'
 *     responses:
 *       200:
 *         description: Correo enviado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de éxito.
 *                 info:
 *                   type: object
 *                   description: Información del envío del correo.
 *       500:
 *         description: Error al enviar el correo.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Mensaje de error.
 *                 error:
 *                   type: string
 *                   description: Detalles del error.
 */

router.post('/', verifyJWT, emailController.enviarCorreo);

module.exports = router;
