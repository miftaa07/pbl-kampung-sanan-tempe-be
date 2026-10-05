import { Router } from 'express';
import { StoreController } from '../controllers/storeController';
import { ProductController } from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadStoreImage } from '../middlewares/uploadMiddleware';
import { handleValidationErrors } from '../middlewares/validationMiddleware';
import { storeValidationRules } from '../utils/validation';

const router = Router();

// Public routes
router.get('/', StoreController.getAllStores);
router.get('/:id', StoreController.getStoreById);
router.get('/:storeId/products', ProductController.getProductsByStore);

// Protected routes (Admin / Auth required)
router.post(
  '/',
  authMiddleware,
  uploadStoreImage,
  storeValidationRules,
  handleValidationErrors,
  StoreController.createStore
);

router.put(
  '/:id',
  authMiddleware,
  uploadStoreImage,
  storeValidationRules,
  handleValidationErrors,
  StoreController.updateStore
);

router.delete('/:id', authMiddleware, StoreController.deleteStore);

export default router;
