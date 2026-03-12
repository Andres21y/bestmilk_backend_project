import express from 'express';
import { 
    applyVaccine, 
    getVaccinationHistory, 
    deleteVaccinationRecord 
} from '../controllers/vaccination.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import validation from '../middleware/validator.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Registrar aplicación (Cualquier usuario aprobado)
router.post('/', validation.validateRecord, applyVaccine);

// Obtener historial (Cualquier usuario aprobado)
router.get('/', getVaccinationHistory);

// Eliminar registro (Solo Administrador)
router.delete('/:id', isAdmin, deleteVaccinationRecord);

export default router;