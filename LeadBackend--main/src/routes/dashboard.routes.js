// backend/src/routes/dashboard.routes.js
import { Router } from 'express';
import * as DashboardController from '../controllers/dashboard.controller.js';
// import { authenticateToken } from '../middleware/auth.middleware.js'; // Uncomment if you have auth middleware

const router = Router();

// router.get('/stats', authenticateToken, DashboardController.getDashboardStats); // Example with auth
router.get('/stats', DashboardController.getDashboardStats); // Example without auth for testing

export default router;