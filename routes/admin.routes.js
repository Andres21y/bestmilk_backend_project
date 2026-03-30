import express from 'express';
import { getUsers, toggleUserStatus, deleteUser } from '../controllers/admin.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas estas rutas requieren Token Y ser Admin
router.use(verifyToken, isAdmin);

router.get('/users', getUsers);
router.put('/users/:id', toggleUserStatus);
router.delete('/users/:id', deleteUser);

export default router;