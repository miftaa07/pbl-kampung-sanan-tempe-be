import { Router } from 'express';
import { HampersController } from '../controllers/hampersController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadHampersImage } from '../middlewares/uploadMiddleware';
import { handleValidationErrors } from '../middlewares/validationMiddleware';
import { hampersValidationRules } from '../utils/validation';

const router = Router();

// Public routes
router.get('/', HampersController.getAllHampers);
router.get('/:id', HampersController.getHampersById);

// Protected routes (Admin / Auth required)
router.post(
  '/',
  authMiddleware,
  uploadHampersImage,
  hampersValidationRules,
  handleValidationErrors,
  HampersController.createHampers
);

router.put(
  '/:id',
  authMiddleware,
  uploadHampersImage,
  hampersValidationRules,
  handleValidationErrors,
  HampersController.updateHampers
);

router.delete('/:id', authMiddleware, HampersController.deleteHampers);

export default router;
