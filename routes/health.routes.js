import express from 'express';
import {
    addHealthRecord,
    getHealthHistory,
    updateHealthRecord,
    deleteHealthRecord
} from '../controllers/health.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { validateHealth } from '../middleware/validator.middleware.js';

const router = express.Router();

// Middleware de autenticación global para estas rutas
router.use(verifyToken);

// Rutas de consulta y creación (Admin y Visitors aprobados)
router.get('/', getHealthHistory);
router.post('/', validateHealth, addHealthRecord);

// Rutas de modificación y eliminación (Solo Admin)
router.put('/:id', isAdmin, validateHealth, updateHealthRecord);
router.delete('/:id', isAdmin, deleteHealthRecord);

export default router;