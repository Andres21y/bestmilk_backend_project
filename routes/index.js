import express from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin.routes.js';
import breedRoutes from './breed.routes.js';
import cattleRoutes from './cattle.routes.js';
import vaccineRoutes from './vaccine.routes.js';

const router = express.Router();

// Prefijos para organizar mejor las rutas
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/breed', breedRoutes);
router.use('/cattle', cattleRoutes);
router.use('/vaccine', vaccineRoutes);

export default router;