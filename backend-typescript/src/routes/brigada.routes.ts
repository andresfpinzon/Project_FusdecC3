import {listarBrigadasController,crearBrigadaController,actualizarBrigadaController,desactivarBrigadaController,obtenerBrigadaPorIdController,buscarBrigadasPorComandoIdController,buscarBrigadasPorUnidadIdController,agregarUnidadesController
} from '@controllers/brigada.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { Router } from 'express';

const brigadaRouter = Router();

/**
 * @openapi
 * /api/brigadas:
 *   get:
 *     tags:
 *       - Brigadas
 *     summary: Obtener todas las brigadas
 *     description: Recupera una lista de todas las brigadas en el sistema.
 *     responses:
 *       200:
 *         description: Lista de brigadas recuperadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombreBrigada:
 *                     type: string
 *                   ubicacionBrigada:
 *                     type: string
 *                   estadoBrigada:
 *                     type: boolean
 *       500:
 *         description: Error interno del servidor
 */
brigadaRouter.get('/', authMiddleware,listarBrigadasController);

/**
 * @openapi
 * /api/brigadas:
 *   post:
 *     tags:
 *       - Brigadas
 *     summary: Crear una nueva brigada
 *     description: Crea una nueva brigada en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreBrigada:
 *                 type: string
 *               ubicacionBrigada:
 *                 type: string
 *               estadoBrigada:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Brigada creada exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
brigadaRouter.post('/', authMiddleware, crearBrigadaController);

/**
 * @openapi
 * /api/brigadas/{id}:
 *   put:
 *     tags:
 *       - Brigadas
 *     summary: Actualizar una brigada
 *     description: Actualiza la información de una brigada existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la brigada a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreBrigada:
 *                 type: string
 *               ubicacionBrigada:
 *                 type: string
 *               estadoBrigada:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Brigada actualizada exitosamente
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
brigadaRouter.put('/:id', authMiddleware, actualizarBrigadaController);

/**
 * @openapi
 * /api/brigadas/{id}:
 *   delete:
 *     tags:
 *       - Brigadas
 *     summary: Desactivar una brigada
 *     description: Desactiva una brigada por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la brigada a desactivar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brigada desactivada exitosamente
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
brigadaRouter.delete('/:id', authMiddleware,desactivarBrigadaController);

/**
 * @openapi
 * /api/brigadas/{id}:
 *   get:
 *     tags:
 *       - Brigadas
 *     summary: Obtener brigada por ID
 *     description: Recupera una brigada específica por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la brigada a recuperar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brigada recuperada exitosamente
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
brigadaRouter.get('/:id', authMiddleware,obtenerBrigadaPorIdController);

/**
 * @openapi
 * /api/brigadas/comando/{comandoId}:
 *   get:
 *     tags:
 *       - Brigadas
 *     summary: Buscar brigadas por comando ID
 *     description: Recupera brigadas asociadas a un comando específico.
 *     parameters:
 *       - name: comandoId
 *         in: path
 *         required: true
 *         description: ID del comando
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brigadas recuperadas exitosamente
 *       404:
 *         description: Comando no encontrado
 *       500:
 *         description: Error interno del servidor
 */
brigadaRouter.get('/comando/:comandoId', authMiddleware,buscarBrigadasPorComandoIdController);

/**
 * @openapi
 * /api/brigadas/unidad/{unidadId}:
 *   get:
 *     tags:
 *       - Brigadas
 *     summary: Buscar brigadas por unidad ID
 *     description: Recupera brigadas asociadas a una unidad específica.
 *     parameters:
 *       - name: unidadId
 *         in: path
 *         required: true
 *         description: ID de la unidad
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Brigadas recuperadas exitosamente
 *       404:
 *         description: Unidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
brigadaRouter.get('/unidad/:unidadId', authMiddleware,buscarBrigadasPorUnidadIdController);

/**
 * @openapi
 * /api/brigadas/{id}/unidades:
 *   post:
 *     tags:
 *       - Brigadas
 *     summary: Agregar unidades a una brigada
 *     description: Agrega unidades a una brigada existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la brigada
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unidadIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Unidades agregadas exitosamente
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
brigadaRouter.post('/:id/unidades', authMiddleware,agregarUnidadesController);

export default brigadaRouter;
