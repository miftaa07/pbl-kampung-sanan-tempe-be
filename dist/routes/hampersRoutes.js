"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const hampersController_1 = require("../controllers/hampersController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
// Public routes
router.get('/', hampersController_1.HampersController.getAllHampers);
router.get('/:id', hampersController_1.HampersController.getHampersById);
// Protected routes (Admin / Auth required)
router.post('/', authMiddleware_1.authMiddleware, uploadMiddleware_1.uploadHampersImage, validation_1.hampersValidationRules, validationMiddleware_1.handleValidationErrors, hampersController_1.HampersController.createHampers);
router.put('/:id', authMiddleware_1.authMiddleware, uploadMiddleware_1.uploadHampersImage, validation_1.hampersValidationRules, validationMiddleware_1.handleValidationErrors, hampersController_1.HampersController.updateHampers);
router.delete('/:id', authMiddleware_1.authMiddleware, hampersController_1.HampersController.deleteHampers);
exports.default = router;
