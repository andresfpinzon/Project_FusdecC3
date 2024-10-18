/**
 * @swagger
 * components:
 *   schemas:
 *     Comando:
 *       type: object
 *       required:
 *         - nombreComando
 *         - estadoComando
 *         - ubicacionComando
 *         - fundacionId
 *       properties:
 *         id:
 *           type: string
 *           description: ID autogenerado del comando.
 *         nombreComando:
 *           type: string
 *           description: Nombre del comando.
 *         estadoComando:
 *           type: boolean
 *           description: Estado del comando (activo/inactivo).
 *           default: true
 *         ubicacionComando:
 *           type: string
 *           description: Ubicación del comando.
 *         fundacionId:
 *           type: string
 *           description: ID de la fundación a la que pertenece el comando.
 *         brigadas:
 *           type: array
 *           items:
 *             type: string
 *           description: IDs de las brigadas asociadas al comando.
 */

/**
 * @swagger
 * tags:
 *   - name: Comando
 *     description: API para gestionar comandos
 */

/**
 * @swagger
 * /api/comandos:
 *   get:
 *     tags:
 *       - Comando
 *     summary: Obtener una lista de comandos
 *     responses:
 *       200:
 *         description: Una colección de comandos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comando'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   - id: "63f7d2bbf1a2b4b5c3cdb700"
 *                     nombreComando: "Comando de Rescate"
 *                     estadoComando: true
 *                     ubicacionComando: "Sector 5, Zona Norte"
 *                     fundacionId: "63f7d2bbf1a2b4b5c3cdb701"
 *                     brigadas: ["63f7d2bbf1a2b4b5c3cdb702", "63f7d2bbf1a2b4b5c3cdb703"]
 */

/**
 * @swagger
 * /api/comandos:
 *   post:
 *     tags:
 *       - Comando
 *     summary: Crear un comando
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comando'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreComando: "Comando de Emergencia"
 *                 estadoComando: true
 *                 ubicacionComando: "Centro de la Ciudad"
 *                 fundacionId: "63f7d2bbf1a2b4b5c3cdb701"
 *                 brigadas: ["63f7d2bbf1a2b4b5c3cdb702"]
 *     responses:
 *       201:
 *         description: Comando creado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comando'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "63f7d2bbf1a2b4b5c3cdb704"
 *                   nombreComando: "Comando de Emergencia"
 *                   estadoComando: true
 *                   ubicacionComando: "Centro de la Ciudad"
 *                   fundacionId: "63f7d2bbf1a2b4b5c3cdb701"
 *                   brigadas: ["63f7d2bbf1a2b4b5c3cdb702"]
 */

/**
 * @swagger
 * /api/comandos/{id}:
 *   get:
 *     tags:
 *       - Comando
 *     summary: Obtener un comando mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comando.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comando obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comando'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "63f7d2bbf1a2b4b5c3cdb700"
 *                   nombreComando: "Comando de Rescate"
 *                   estadoComando: true
 *                   ubicacionComando: "Sector 5, Zona Norte"
 *                   fundacionId: "63f7d2bbf1a2b4b5c3cdb701"
 *                   brigadas: ["63f7d2bbf1a2b4b5c3cdb702", "63f7d2bbf1a2b4b5c3cdb703"]
 *       404:
 *         description: Comando no encontrado.
 */

/**
 * @swagger
 * /api/comandos/{id}:
 *   put:
 *     tags:
 *       - Comando
 *     summary: Actualizar un comando mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comando a actualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comando'
 *           examples:
 *             ejemplo1:
 *               value:
 *                 nombreComando: "Comando de Rescate Actualizado"
 *                 estadoComando: false
 *                 ubicacionComando: "Sector 5, Zona Norte"
 *                 fundacionId: "63f7d2bbf1a2b4b5c3cdb701"
 *                 brigadas: ["63f7d2bbf1a2b4b5c3cdb702"]
 *     responses:
 *       200:
 *         description: Comando actualizado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comando'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "63f7d2bbf1a2b4b5c3cdb700"
 *                   nombreComando: "Comando de Rescate Actualizado"
 *                   estadoComando: false
 *                   ubicacionComando: "Sector 5, Zona Norte"
 *                   fundacionId: "63f7d2bbf1a2b4b5c3cdb701"
 *                   brigadas: ["63f7d2bbf1a2b4b5c3cdb702"]
 *       404:
 *         description: Comando no encontrado.
 */

/**
 * @swagger
 * /api/comandos/{id}:
 *   delete:
 *     tags:
 *       - Comando
 *     summary: Desactivar un comando mediante su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comando a desactivar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comando desactivado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comando'
 *             examples:
 *               ejemplo1:
 *                 value:
 *                   id: "63f7d2bbf1a2b4b5c3cdb700"
 *                   nombreComando: "Comando de Rescate"
 *                   estadoComando: false
 *                   ubicacionComando: "Sector 5, Zona Norte"
 *                   fundacionId: "63f7d2bbf1a2b4b5c3cdb701"
 *                   brigadas: ["63f7d2bbf1a2b4b5c3cdb702", "63f7d2bbf1a2b4b5c3cdb703"]
 *       404:
 *         description: Comando no encontrado.
 */