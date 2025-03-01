import { Router } from "express";
import { deleteUserController, getAllUsersController, getUserByIdController, toggleStatusUserController, updateUserController } from "@controllers/user.controllers";
import { authMiddleware } from "@middlewares/auth.middleware";

const userRouter = Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60d21b4667d0d8992e610c85
 *         username:
 *           type: string
 *           example: john_doe
 *         email:
 *           type: string
 *           format: email
 *           example: john.doe@example.com
 *         isActive:
 *           type: boolean
 *           example: true
 *         role:
 *           type: array
 *           items:
 *             type: string
 *             enum: [ADMIN, USER, GUEST]
 *           example: [USER]
 *       required:
 *         - username
 *         - email
 *         - isActive
 *         - role
 *     
 *     UpdateUserDto:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: updated_username
 *         email:
 *           type: string
 *           format: email
 *           example: updated.email@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: newSecurePassword123
 *         isActive:
 *           type: boolean
 *           example: true
 *         role:
 *           type: array
 *           items:
 *             type: string
 *             enum: [ADMIN, USER, GUEST]
 *           example: [ADMIN, USER]
 *     
 *     UserResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: Operation successful
 *         data:
 *           $ref: '#/components/schemas/User'
 *     
 *     UsersListResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: Users retrieved successfully
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           example: 400
 *         message:
 *           type: string
 *           example: Error message
 */

/**
 * @openapi
 * /api/user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieves a list of all users in the system.
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersListResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get("/", authMiddleware, getAllUsersController);

/**
 * @openapi
 * /api/user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieves a specific user by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.get("/:id", authMiddleware,getUserByIdController);

/**
 * @openapi
 * /api/user/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user
 *     description: Updates a user's information by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserDto'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request - Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.put("/:id", authMiddleware,updateUserController);

/**
 * @openapi
 * /api/user/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Toggle user status
 *     description: Toggles a user's active status (active/inactive).
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to toggle status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.patch("/:id", authMiddleware,toggleStatusUserController);

/**
 * @openapi
 * /api/user/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     description: Deletes a user by their ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
userRouter.delete("/:id", authMiddleware,deleteUserController);

export default userRouter;