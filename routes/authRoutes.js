import express from 'express';
import { signup, login, forgotPassword, resetPassword } from '../controllers/authController.js';
import validation from '../middleware/validator.js';

const router = express.Router();

router.post('/login', validation.validateLogin, login);
router.post('/signup', validation.validateRegister, signup);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;