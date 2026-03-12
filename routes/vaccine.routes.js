import express from 'express';
import { 
    createVaccine, 
    getAllVaccines, 
    updateVaccine, 
    deleteVaccine 
} from '../controllers/vaccine.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import validation from '../middleware/validator.middleware.js';

const router = express.Router();

// Todas las rutas requieren token
router.use(verifyToken);

// Disponible para todos los usuarios autenticados
router.get('/', getAllVaccines);

// POST, PUT, DELETE: Solo para Administradores
router.post('/', [isAdmin, validation.validateVaccine], createVaccine);
router.put('/:id', [isAdmin, validation.validateVaccine], updateVaccine);
router.delete('/:id', isAdmin, deleteVaccine);

export default router;