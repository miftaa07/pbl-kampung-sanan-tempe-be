import { Router } from 'express';
import { ActivityController } from '../controllers/activityController';

const router = Router();

router.get('/', ActivityController.getActivityLogs);

export default router;
