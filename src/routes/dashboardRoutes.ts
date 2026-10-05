import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';

const router = Router();

router.get('/', DashboardController.getDashboard);

export default router;
