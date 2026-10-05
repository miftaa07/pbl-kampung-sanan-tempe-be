import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { uploadProductImage } from '../middlewares/uploadMiddleware';
import { handleValidationErrors } from '../middlewares/validationMiddleware';
import { productValidationRules } from '../utils/validation';

const router = Router();

// Public routes
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// Protected routes (Admin / Auth required)
router.post(
  '/',
  authMiddleware,
  uploadProductImage,
  productValidationRules,
  handleValidationErrors,
  ProductController.createProduct
);

router.put(
  '/:id',
  authMiddleware,
  uploadProductImage,
  productValidationRules,
  handleValidationErrors,
  ProductController.updateProduct
);

router.delete('/:id', authMiddleware, ProductController.deleteProduct);

export default router;
