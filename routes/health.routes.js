import express from 'express';
import { 
    addHealthRecord, 
    getHealthHistory, 
    updateHealthRecord,
    deleteHealthRecord 
} from '../controllers/health.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import validation from '../middleware/validator.middleware.js';

const router = express.Router();

// Middleware de autenticación global para estas rutas
router.use(verifyToken);

// Rutas de consulta y creación (Admin y Visitors aprobados)
router.get('/', getHealthHistory);
router.post('/', validation.validateHealth, addHealthRecord);

// Rutas de modificación y eliminación (Solo Admin)
router.put('/:id', isAdmin, validation.validateHealth, updateHealthRecord);
router.delete('/:id', isAdmin, deleteHealthRecord);

export default router;