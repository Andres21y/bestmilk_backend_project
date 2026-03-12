import express from 'express';
import { 
    addCalving, 
    getCalvingHistory, 
    deleteCalvingRecord 
} from '../controllers/calving.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import validation from '../middleware/validator.middleware.js';

const router = express.Router();

// Protección global de rutas
router.use(verifyToken);

// Registro y Lectura
router.post('/', validation.validateCalving, addCalving);
router.get('/', getCalvingHistory);

// Borrado (Restringido a Admin)
router.delete('/:id', isAdmin, deleteCalvingRecord);

export default router;