import express from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import breedRoutes from './breed.routes.js';

const router = express.Router();

// Prefijos para organizar mejor las rutas
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/breed', breedRoutes);

export default router;