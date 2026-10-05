"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = handleValidationErrors;
const express_validator_1 = require("express-validator");
function handleValidationErrors(req, res, next) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach((err) => {
            const field = err.path || err.param || 'general';
            if (!formattedErrors[field]) {
                formattedErrors[field] = err.msg;
            }
        });
        return res.status(400).json({
            success: false,
            message: 'Input tidak valid',
            errors: formattedErrors
        });
    }
    next();
}
