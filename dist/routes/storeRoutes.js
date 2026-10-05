"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const storeController_1 = require("../controllers/storeController");
const productController_1 = require("../controllers/productController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Public routes
router.get('/', storeController_1.StoreController.getAllStores);
router.get('/:id', storeController_1.StoreController.getStoreById);
router.get('/:storeId/products', productController_1.ProductController.getProductsByStore);
// Protected routes (Admin / Auth required)
router.post('/', authMiddleware_1.authMiddleware, uploadMiddleware_1.uploadStoreImage, validation_1.storeValidationRules, validationMiddleware_1.handleValidationErrors, storeController_1.StoreController.createStore);
router.put('/:id', authMiddleware_1.authMiddleware, uploadMiddleware_1.uploadStoreImage, validation_1.storeValidationRules, validationMiddleware_1.handleValidationErrors, storeController_1.StoreController.updateStore);
router.delete('/:id', authMiddleware_1.authMiddleware, storeController_1.StoreController.deleteStore);
exports.default = router;
