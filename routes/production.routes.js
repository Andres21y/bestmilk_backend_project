import express from 'express';
import {
    addProduction,
    getProductionHistory,
    deleteProductionRecord
} from '../controllers/production.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { validateProduction } from '../middleware/validator.middleware.js';

const router = express.Router();

// Todas las rutas requieren token
router.use(verifyToken);

// Registro y Consulta (Visitor/Admin)
router.post('/', validateProduction, addProduction);
router.get('/', getProductionHistory);

// Eliminación (Solo Admin)
router.delete('/:id', isAdmin, deleteProductionRecord);

export default router;