"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Public routes
router.get('/', productController_1.ProductController.getAllProducts);
router.get('/:id', productController_1.ProductController.getProductById);
// Protected routes (Admin / Auth required)
router.post('/', authMiddleware_1.authMiddleware, uploadMiddleware_1.uploadProductImage, validation_1.productValidationRules, validationMiddleware_1.handleValidationErrors, productController_1.ProductController.createProduct);
router.put('/:id', authMiddleware_1.authMiddleware, uploadMiddleware_1.uploadProductImage, validation_1.productValidationRules, validationMiddleware_1.handleValidationErrors, productController_1.ProductController.updateProduct);
router.delete('/:id', authMiddleware_1.authMiddleware, productController_1.ProductController.deleteProduct);
exports.default = router;
