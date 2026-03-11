import express from 'express';
import {
    createBreeds as create, getBreeds as read,
    updateBreed as update, deleteBreed as drop
} from '../controllers/breedController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';
import validation from '../middleware/validator.js';

const router = express.Router();

// Public/Visitor access (Read-only)
router.get('/', verifyToken, read);

// Admin-only access (Write/Modify/Delete)
router.post('/', [verifyToken, isAdmin, validation.validateBreed], create);
router.put('/:id', [verifyToken, isAdmin, validation.validateBreed], update);
router.delete('/:id', [verifyToken, isAdmin], drop);

export default router;