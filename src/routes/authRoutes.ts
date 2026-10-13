import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { handleValidationErrors } from '../middlewares/validationMiddleware';
import { emailValidation, passwordValidation, nameValidation } from '../utils/validation';

const router = Router();

router.post(
  '/register',
  [nameValidation('name', 'Nama Lengkap'), emailValidation, passwordValidation, handleValidationErrors],
  AuthController.register
);

router.post(
  '/login',
  [emailValidation, handleValidationErrors],
  AuthController.login
);

router.get('/me', authMiddleware, AuthController.getMe);

// ==========================================
// BARU: ENDPOINT LOGOUT
// ==========================================
router.post('/logout', authMiddleware, AuthController.logout);

export default router;
