import express from 'express';
import rateLimit from 'express-rate-limit';
import { signup, login, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import validation from '../middleware/validator.middleware.js';

const router = express.Router();

// Limitador de peticiones para evitar fuerza bruta en login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de 100 peticiones por IP
});

router.post('/login', loginLimiter, validation.validateLogin, login);
router.post('/signup', validation.validateRegister, signup);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
