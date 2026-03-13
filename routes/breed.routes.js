import express from 'express';
import {
    createBreeds as create, getBreeds as read,
    updateBreed as update, deleteBreed as drop
} from '../controllers/breed.controller.js';
import { verifyToken, isAdmin } from '../middleware/auth.middleware.js';
import { validateBreed } from '../middleware/validator.middleware.js';

const router = express.Router();

// Public/Visitor access (Read-only)
router.get('/', verifyToken, read);

// Admin-only access (Write/Modify/Delete)
router.post('/', [verifyToken, isAdmin, validateBreed], create);
router.put('/:id', [verifyToken, isAdmin, validateBreed], update);
router.delete('/:id', [verifyToken, isAdmin], drop);

export default router;