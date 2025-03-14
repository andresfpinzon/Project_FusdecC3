import {listarComandosController,crearComandoController,actualizarComandoController,desactivarComandoController,buscarComandoPorIdController
} from '@controllers/comando.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { Router } from 'express';

const comandoRouter = Router();

/**
 * @openapi
 * /api/comandos:
 *   get:
 *     tags:
 *       - Comandos
 *     summary: Obtener todos los comandos
 *     description: Recupera una lista de todos los comandos en el sistema.
 *     responses:
 *       200:
 *         description: Lista de comandos recuperados exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombreComando:
 *                     type: string
 *                   descripcion:
 *                     type: string
 *                   estadoComando:
 *                     type: boolean
 *       500:
 *         description: Error interno del servidor
 */
comandoRouter.get('/', authMiddleware,listarComandosController);

/**
 * @openapi
 * /api/comandos:
 *   post:
 *     tags:
 *       - Comandos
 *     summary: Crear un nuevo comando
 *     description: Crea un nuevo comando en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreComando:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estadoComando:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Comando creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
comandoRouter.post('/', authMiddleware, crearComandoController);

/**
 * @openapi
 * /api/comandos/{id}:
 *   put:
 *     tags:
 *       - Comandos
 *     summary: Actualizar un comando
 *     description: Actualiza la información de un comando existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del comando a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreComando:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estadoComando:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Comando actualizado exitosamente
 *       404:
 *         description: Comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
comandoRouter.put('/:id', authMiddleware, actualizarComandoController);

/**
 * @openapi
 * /api/comandos/{id}:
 *   delete:
 *     tags:
 *       - Comandos
 *     summary: Desactivar un comando
 *     description: Desactiva un comando por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del comando a desactivar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comando desactivado exitosamente
 *       404:
 *         description: Comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
comandoRouter.delete('/:id', authMiddleware,desactivarComandoController);

/**
 * @openapi
 * /api/comandos/{id}:
 *   get:
 *     tags:
 *       - Comandos
 *     summary: Obtener comando por ID
 *     description: Recupera un comando específico por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del comando a recuperar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comando recuperado exitosamente
 *       404:
 *         description: Comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
comandoRouter.get('/:id', authMiddleware,buscarComandoPorIdController);

export default comandoRouter;
