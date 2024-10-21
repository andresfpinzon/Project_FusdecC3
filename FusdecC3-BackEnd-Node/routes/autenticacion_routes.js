const express = require('express');
const router = express.Router();
const { login } = require('../controllers/autenticacion_controllers'); // Ajusta la ruta según tu estructura de carpetas

/**
 * @swagger
 * components:
 *   schemas:
 *     AuthLogin:
 *       type: object
 *       required:
 *         - correo
 *         - contraseña
 *       properties:
 *         correo:
 *           type: string
 *           description: Correo del usuario
 *           example: usuario@example.com
 *         contraseña:
 *           type: string
 *           description: Contraseña del usuario
 *           example: tu_contraseña
 *     AuthTokenResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: Token JWT generado
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de error
 *           example: 'Usuario no encontrado'
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a los usuarios iniciar sesión en la aplicación y obtener un token JWT.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correo:
 *                 type: string
 *                 example: usuario@example.com
 *               contraseña:
 *                 type: string
 *                 example: tu_contraseña
 *     responses:
 *       200:
 *         description: Token JWT generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Usuario no encontrado o contraseña incorrecta.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Usuario no encontrado'
 *       500:
 *         description: Error en el servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Error en el servidor'
 */
router.post('/login', login);

module.exports = router;
