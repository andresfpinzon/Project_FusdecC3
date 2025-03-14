import {listarUnidadesController,crearUnidadController,editarUnidadController,desactivarUnidadController,buscarUnidadPorIdController,buscarUnidadesPorBrigadaIdController,buscarUnidadesPorUsuarioIdController
} from '@controllers/unidad.controller';
import { authMiddleware } from '@middlewares/auth.middleware';
import { Router } from 'express';

const unidadRouter = Router();

/**
 * @openapi
 * /api/unidades:
 *   get:
 *     tags:
 *       - Unidades
 *     summary: Obtener todas las unidades
 *     description: Recupera una lista de todas las unidades en el sistema.
 *     responses:
 *       200:
 *         description: Lista de unidades recuperadas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nombreUnidad:
 *                     type: string
 *                   estadoUnidad:
 *                     type: boolean
 *                   brigadaId:
 *                     type: string
 *                   usuarioId:
 *                     type: string
 *       500:
 *         description: Error interno del servidor
 */
unidadRouter.get('/', authMiddleware,listarUnidadesController);

/**
 * @openapi
 * /api/unidades:
 *   post:
 *     tags:
 *       - Unidades
 *     summary: Crear una nueva unidad
 *     description: Crea una nueva unidad en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreUnidad:
 *                 type: string
 *               estadoUnidad:
 *                 type: boolean
 *               brigadaId:
 *                 type: string
 *               usuarioId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Unidad creada exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error interno del servidor
 */
unidadRouter.post('/', authMiddleware, crearUnidadController);

/**
 * @openapi
 * /api/unidades/{id}:
 *   put:
 *     tags:
 *       - Unidades
 *     summary: Editar una unidad
 *     description: Edita la información de una unidad existente.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la unidad a editar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreUnidad:
 *                 type: string
 *               estadoUnidad:
 *                 type: boolean
 *               brigadaId:
 *                 type: string
 *               usuarioId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unidad editada exitosamente
 *       404:
 *         description: Unidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
unidadRouter.put('/:id', authMiddleware, editarUnidadController);

/**
 * @openapi
 * /api/unidades/{id}:
 *   delete:
 *     tags:
 *       - Unidades
 *     summary: Desactivar una unidad
 *     description: Desactiva una unidad por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la unidad a desactivar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unidad desactivada exitosamente
 *       404:
 *         description: Unidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
unidadRouter.delete('/:id', authMiddleware,desactivarUnidadController);

/**
 * @openapi
 * /api/unidades/{id}:
 *   get:
 *     tags:
 *       - Unidades
 *     summary: Obtener unidad por ID
 *     description: Recupera una unidad específica por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la unidad a recuperar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unidad recuperada exitosamente
 *       404:
 *         description: Unidad no encontrada
 *       500:
 *         description: Error interno del servidor
 */
unidadRouter.get('/:id', authMiddleware,buscarUnidadPorIdController);

/**
 * @openapi
 * /api/unidades/brigada/{brigadaId}:
 *   get:
 *     tags:
 *       - Unidades
 *     summary: Buscar unidades por brigada ID
 *     description: Recupera unidades asociadas a una brigada específica.
 *     parameters:
 *       - name: brigadaId
 *         in: path
 *         required: true
 *         description: ID de la brigada
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unidades recuperadas exitosamente
 *       404:
 *         description: Brigada no encontrada
 *       500:
 *         description: Error interno del servidor
 */
unidadRouter.get('/brigada/:brigadaId', authMiddleware,buscarUnidadesPorBrigadaIdController);

/**
 * @openapi
 * /api/unidades/usuario/{usuarioId}:
 *   get:
 *     tags:
 *       - Unidades
 *     summary: Buscar unidades por usuario ID
 *     description: Recupera unidades asociadas a un usuario específico.
 *     parameters:
 *       - name: usuarioId
 *         in: path
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unidades recuperadas exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
unidadRouter.get('/usuario/:usuarioId', authMiddleware,buscarUnidadesPorUsuarioIdController);

export default unidadRouter;
