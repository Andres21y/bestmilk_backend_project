import express from 'express';
import { 
    createCattle, 
    getAllCattle, 
    getCattleById, 
    updateCattle, 
    deleteCattle 
} from '../controllers/cattle.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import validation from '../middleware/validator.middleware.js';

const router = express.Router();

// las rutas requieren token de sesión
router.use(verifyToken);

// Rutas accesibles por cualquier usuario autenticado
router.get('/', getAllCattle);
router.get('/:id', getCattleById);
router.post('/', validation.validateCattle, createCattle);
router.put('/:id', validation.validateCattle, updateCattle);

// Solo el ADMIN puede eliminar registros de ganado
router.delete('/:id', isAdmin, deleteCattle);

export default router;